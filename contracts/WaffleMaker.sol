pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract WaffleMaker {
    // ******************** CONSTANTS ***********************
    uint constant MAX_NAME_BYTES = 20;
    uint constant MAX_DESCRIPTION_BYTES = 75;
    uint constant MAX_WAFFLE_LAYERS = 5;
    uint constant MAX_VOTES_PER_ACCOUNT = 3;
    uint constant COMPETITION_DURATION = 60 * 60 * 24 * 30;
    uint constant BAKE_DURATION = 10;//60 * 60 * 24;
    uint constant CUSTOMIZE_DURATION = 120;//60 * 60 * 24;
    uint constant CUSTOMIZATION_STEPS_COUNT = 6;
    uint constant CUSTOMIZATION_STEP_WINDOW_DURATION = 30;//60 * 60;
    uint24[CUSTOMIZATION_STEPS_COUNT] CUSTOMIZATION_STEP_WINDOWS = [
        0,//0,
        30,//60 * 60,
        60,//60 * 60 * 9,
        90,//60 * 60 * 17,
        120,//60 * 60 * 24,
        0
    ];

    // ******************** DATA ***********************
    // Static data
    address public admin; // Also the address to which the 10% dev fund is sent to
    uint public competitionEndTimestamp;

    // Semi static data
    WaffleItem[] public toppings;
    WaffleItem[] public bases;
    WaffleItem[] public plates;
    WaffleItem[] public extras;

    // Variable data
    Waffle[] waffles;
    uint[] publishedWaffles;
    mapping(address => AccountProfile) profiles;
    bool competitionConcluded;

    // ******************** STRUCTS ***********************
    enum CustomizationStep {
        NOT_CUSTOMIZED,
        PLATE,
        BASE,
        TOPPING,
        EXTRA,
        DONE
    }

    struct WaffleItem {
        string name;
        uint price;
    }

    struct WaffleLayer {
        uint baseId;
        uint toppingId;
    }

    struct Waffle {
        address owner;
        uint votes;
        string name;
        string description;
        uint plateId;
        uint extraId;
        mapping(uint => WaffleLayer) layers;
        uint layersCount;
        bool published;
        CustomizationStep customizationStep;
        uint processEnd; // Saves the Unix timestamp at which either the baking or customization ends
    }

    struct AccountProfile {
        mapping(uint => uint) ownedWaffles;
        uint ownedWafflesCount;
        mapping(uint => uint) votedWaffles;
        uint votedWafflesCount;
        uint publishedWafflesCount;
    }

    // ******************** MODIFIERS ***********************
    modifier competitionIsOngoing {
        require(block.timestamp < competitionEndTimestamp, "Competition must be ongoing");
        _;
    }

    modifier competitionHasEnded {
        require(block.timestamp >= competitionEndTimestamp, "Competition must have ended");
        _;
    }

    modifier waffleExists(uint waffleId) {
        require(waffleId < waffles.length, "This waffle doesn't exist");
        _;
    }

    modifier waffleIsPublished(bool positive, uint waffleId) {
        require(waffles[waffleId].published == positive, "Invalid published state");
        _;
    }

    modifier senderOwnsWaffle(bool positive, uint waffleId) {
        bool waffleOwned = false;
        for (uint i = 0; i < profiles[msg.sender].ownedWafflesCount; i++) {
            if (profiles[msg.sender].ownedWaffles[i] == waffleId) {
                waffleOwned = true;
            }
        }
        require(waffleOwned == positive, "Invalid waffle owner");
        _;
    }

    // ******************** CONSTRUCTOR ***********************
    constructor() public {
        admin = msg.sender;
        competitionEndTimestamp = block.timestamp + COMPETITION_DURATION;

        toppings.push(WaffleItem('Empty', 0));
        bases.push(WaffleItem('Empty', 0));
        plates.push(WaffleItem('Plain Plate', 0));
        extras.push(WaffleItem('Empty', 0));
    }

    // ******************** SEND FUNCTIONS ***********************
    function createWaffle() external competitionIsOngoing {
        waffles.push(Waffle({
            owner: msg.sender,
            votes: 0,
            name: "",
            description: "",
            plateId: 0,
            extraId: 0,
            layersCount: 0,
            published: false,
            processEnd: block.timestamp + BAKE_DURATION,
            customizationStep: CustomizationStep.NOT_CUSTOMIZED
        }));
        addWaffleLayer(waffles.length - 1);

        profiles[msg.sender].ownedWaffles[profiles[msg.sender].ownedWafflesCount++] = waffles.length - 1;
    }

    /**
    *   Add a new layer to the waffleId provided if the waffle is owned by the sender and if last
    *   layer has been customized
    **/
    function bakeWaffleLayer(uint waffleId) external competitionIsOngoing waffleExists(waffleId) senderOwnsWaffle(true, waffleId) {
        require(waffles[waffleId].customizationStep == CustomizationStep.DONE, "Last layer must be customized");
        require(block.timestamp > waffles[waffleId].processEnd, "Waffle already being processed");
        addWaffleLayer(waffleId);
        waffles[waffleId].processEnd = block.timestamp + BAKE_DURATION;
    }

    function submitWaffleCustomization(uint waffleId, string memory name, string memory description, uint baseId, uint toppingId, uint extraId, uint plateId) external competitionIsOngoing waffleExists(waffleId) senderOwnsWaffle(true, waffleId) {
        require(waffles[waffleId].customizationStep == CustomizationStep.NOT_CUSTOMIZED, "Last layer must not already be customized");

        if (waffles[waffleId].layersCount <= 1) {
            require(stringIsNotEmpty(name), "Waffle name can't be empty");
            require(stringSizeLowerOrEqual(name, MAX_NAME_BYTES), "Max name length exceeded");
            require(stringSizeLowerOrEqual(description, MAX_DESCRIPTION_BYTES), "Max description length exceeded");

            waffles[waffleId].name = name;
            waffles[waffleId].description = description;
            waffles[waffleId].plateId = plateId;
            waffles[waffleId].extraId = extraId;
        }
        uint lastLayerIndex = waffles[waffleId].layersCount - 1;
        waffles[waffleId].layers[lastLayerIndex].baseId = baseId;
        waffles[waffleId].layers[lastLayerIndex].toppingId = toppingId;
        waffles[waffleId].processEnd = block.timestamp + CUSTOMIZE_DURATION;
        calculateNextWaffleCustomizationStep(waffleId);
    }

    function advanceWaffleCustomizationStep(uint waffleId) external competitionIsOngoing waffleExists(waffleId) senderOwnsWaffle(true, waffleId) waffleIsPublished(false, waffleId)  {
        require(waffles[waffleId].customizationStep < CustomizationStep.DONE, 'All customization steps done');
        uint stepNumber = uint(waffles[waffleId].customizationStep);
        uint processStart = waffles[waffleId].processEnd - CUSTOMIZE_DURATION;
        uint customizationWindowEnd = processStart + CUSTOMIZATION_STEP_WINDOWS[stepNumber];
        uint customizationWindowStart = customizationWindowEnd - CUSTOMIZATION_STEP_WINDOW_DURATION;
        require(block.timestamp > customizationWindowStart, 'Not within the customization window');
        require(block.timestamp < customizationWindowEnd, 'Waffle burned');

        calculateNextWaffleCustomizationStep(waffleId);
    }

    /**
    *   Makes a waffle available for voting and blocks further customization
    **/
    function publishWaffle(uint waffleId) external competitionIsOngoing waffleExists(waffleId) senderOwnsWaffle(true, waffleId) waffleIsPublished(false, waffleId) {
        require(waffles[waffleId].customizationStep == CustomizationStep.DONE, 'At least one layer must be customized');
        waffles[waffleId].published = true;
        publishedWaffles.push(waffleId);
        profiles[msg.sender].publishedWafflesCount++;
    }

    /**
    *   Cast a vote for the waffleId provided from the sender account.
    *
    *   Waffle must be published by calling publishWaffle to be voted on
    *
    *   No more than MAX_VOTES_PER_ACCOUNT votes can be cast per account.
    **/
    function voteWaffle(uint waffleId) external competitionIsOngoing waffleExists(waffleId) senderOwnsWaffle(false, waffleId) waffleIsPublished(true, waffleId) {
        require(profiles[msg.sender].publishedWafflesCount > 0, "Must have published at least one waffle to vote");
        require(profiles[msg.sender].votedWafflesCount < MAX_VOTES_PER_ACCOUNT, "Max votes on this account exceeded");
        require(!accountHasVotedOnWaffle(msg.sender, waffleId), "Can't vote for the same waffle twice");

        waffles[waffleId].votes++;
        profiles[msg.sender].votedWaffles[profiles[msg.sender].votedWafflesCount++] = waffleId;
    }

    /**
    *   Concludes the competition and distributes the rewards to the owner
    *   of the waffle with the most votes
    *
    *   Can be called by anyone past the competition end timestamp
    **/
    function concludeCompetition() external competitionHasEnded {
        require(!competitionConcluded, "Competition has already been concluded");

        competitionConcluded = true;
    }

    // ******************** VIEW FUNCTIONS ***********************
    /**
    *   Returns the data of the waffle associated to a waffle id
    **/
    function getWaffleInfo(uint waffleId) external view waffleExists(waffleId) returns (address owner, string memory name, string memory description, uint votes, uint extraId, uint plateId, uint processEnd, bool published, CustomizationStep customizationStep, WaffleLayer[] memory layers)  {
        Waffle memory waffle = waffles[waffleId];
        WaffleLayer[] memory waffleLayers = new WaffleLayer[](waffle.layersCount);
        for (uint i = 0; i < waffle.layersCount; i++) {
            waffleLayers[i] = waffles[waffleId].layers[i];
        }
        return (waffle.owner, waffle.name, waffle.description, waffle.votes, waffle.extraId, waffle.plateId, waffle.processEnd, waffle.published, waffle.customizationStep, waffleLayers);
    }

    /**
    *   Returns the profile data associated to an address
    **/
    function getProfileInfo(address addr) external view returns (uint[] memory ownedWaffleIds, uint[] memory votedWaffleIds, uint publishedWafflesCount) {
        uint[] memory profileOwnedWaffles = new uint[](profiles[addr].ownedWafflesCount);
        for (uint i = 0; i < profiles[addr].ownedWafflesCount; i++) {
            profileOwnedWaffles[i] = profiles[addr].ownedWaffles[i];
        }

        uint[] memory profileVotedWaffles = new uint[](profiles[addr].votedWafflesCount);
        for (uint i = 0; i < profiles[addr].votedWafflesCount; i++) {
            profileVotedWaffles[i] = profiles[addr].votedWaffles[i];
        }
        return (profileOwnedWaffles, profileVotedWaffles, profiles[addr].publishedWafflesCount);
    }

    // ******************** INTERNAL FUNCTIONS ***********************
    function stringIsNotEmpty(string memory str) internal returns(bool) {
        bytes memory strBytes = bytes(str);
        return strBytes.length > 0;
    }

    function stringSizeLowerOrEqual(string memory str, uint size) internal returns(bool) {
        bytes memory strBytes = bytes(str);
        return strBytes.length <= size;
    }

    function addWaffleLayer(uint waffleId) internal {
        require(waffles[waffleId].layersCount < MAX_WAFFLE_LAYERS, "You cannot add more layers to this waffle");
        waffles[waffleId].layers[waffles[waffleId].layersCount++] = WaffleLayer(0,0);
        waffles[waffleId].customizationStep = CustomizationStep.NOT_CUSTOMIZED;
    }

    function waffleCustomizationStepCanBeSkipped(uint waffleId) internal returns(bool) {
        if (waffles[waffleId].layersCount == 1) {
            if (waffles[waffleId].customizationStep == CustomizationStep.PLATE && waffles[waffleId].plateId == 0) {
                return true;
            } else if(waffles[waffleId].customizationStep == CustomizationStep.EXTRA && waffles[waffleId].extraId == 0) {
                return true;
            } else if(waffles[waffleId].customizationStep == CustomizationStep.BASE && waffles[waffleId].layers[waffles[waffleId].layersCount - 1].baseId == 0) {
                return true;
            } else if(waffles[waffleId].customizationStep == CustomizationStep.TOPPING && waffles[waffleId].layers[waffles[waffleId].layersCount - 1].toppingId == 0) {
                return true;
            } else {
                return false;
            }
        } else {
            if (waffles[waffleId].customizationStep == CustomizationStep.PLATE) {
                return true;
            } else if(waffles[waffleId].customizationStep == CustomizationStep.EXTRA) {
                return true;
            } else if(waffles[waffleId].customizationStep == CustomizationStep.BASE && waffles[waffleId].layers[waffles[waffleId].layersCount - 1].baseId == 0) {
                return true;
            } else if(waffles[waffleId].customizationStep == CustomizationStep.TOPPING && waffles[waffleId].layers[waffles[waffleId].layersCount - 1].toppingId == 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    function calculateNextWaffleCustomizationStep(uint waffleId) internal {
        do {
            uint newStepNumber = uint(waffles[waffleId].customizationStep) + 1;
            waffles[waffleId].customizationStep = CustomizationStep(newStepNumber);
        } while (waffleCustomizationStepCanBeSkipped(waffleId));
    }

    function accountHasVotedOnWaffle(address account, uint waffleId) internal returns(bool) {
        for (uint i = 0; i < profiles[account].votedWafflesCount; i++) {
            if (profiles[account].votedWaffles[i] == waffleId) {
                return true;
            }
        }
        return false;
    }
}
