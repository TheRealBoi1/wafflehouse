pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract WaffleMaker {
    // ******************** CONSTANTS ***********************
    uint constant MAX_WAFFLE_LAYERS = 5;
    uint constant MAX_VOTES_PER_ACCOUNT = 3;
    uint constant COMPETITION_DURATION = 2592000; // 1 month duration

    // ******************** DATA ***********************
    // Static data
    address public admin; // Also the address to which the 10% dev fund is sent to
    uint competitionStart;

    // Semi static data
    WaffleItem[] public toppings;
    WaffleItem[] public bases;
    WaffleItem[] public plates;
    WaffleItem[] public extras;

    // Variable data
    Waffle[] waffles;
    uint[3] recentWaffles;
    mapping(address => AccountProfile) profiles;
    bool competitionConcluded;

    // ******************** STRUCTS ***********************
    struct WaffleItem {
        string name;
        uint price;
    }

    struct WaffleLayer {
        uint baseId;
        uint toppingId;
        bool customized;
    }

    struct Waffle {
        address owner;
        uint votes;
        uint actionStart; // Saves the Unix timestamp at which the either bake or customization worked
        string name;
        string description;
        uint plateId;
        uint extraId;
        mapping(uint => WaffleLayer) layers;
        uint layersCount;
    }

    struct AccountProfile {
        mapping(uint => uint) ownedWaffles;
        uint ownedWafflesCount;
        mapping(uint => uint) votedWaffles;
        uint votedWafflesCount;
    }

    // ******************** MODIFIERS ***********************
    modifier competitionIsOngoing {
        uint endTimestamp = competitionStart + COMPETITION_DURATION;
        require(block.timestamp < endTimestamp, "Competition must be ongoing");
        _;
    }

    modifier competitionHasEnded {
        uint endTimestamp = competitionStart + COMPETITION_DURATION;
        require(block.timestamp >= endTimestamp, "Competition must have ended");
        _;
    }

    modifier waffleExists(uint waffleId) {
        require(waffleId < waffles.length, "This waffle doesn't exist");
        _;
    }

    // ******************** CONSTRUCTOR ***********************
    constructor() public {
        admin = msg.sender;
        competitionStart = block.timestamp;

        toppings.push(WaffleItem('Empty', 0));
        bases.push(WaffleItem('Empty', 0));
        plates.push(WaffleItem('Empty', 0));
        extras.push(WaffleItem('Empty', 0));
    }

    // ******************** SEND FUNCTIONS ***********************
    function createWaffle() external competitionIsOngoing {
        waffles.push(Waffle({
            owner: msg.sender,
            votes: 0,
            actionStart: block.timestamp,
            name: "",
            description: "",
            plateId: 0,
            extraId: 0,
            layersCount: 0
        }));
        addWaffleLayer(waffles.length - 1);

        profiles[msg.sender].ownedWaffles[profiles[msg.sender].ownedWafflesCount++] = waffles.length - 1;
    }

    /**
    *   Add a new layer to the waffleId provided if the waffle is owned by the sender and if last
    *   layer has been customized
    **/
    function bakeWaffleLayer(uint waffleId) external competitionIsOngoing waffleExists(waffleId) {
        require(accountOwnsWaffle(msg.sender, waffleId), "You can't bake a layer for a waffle you do not own");
        require(lastWaffleLayerIsCustomized(waffleId), "You can't add a new layer if the last waffle layer hasn't been customized");

        addWaffleLayer(waffleId);
    }

    function customizeWaffleLayer(uint waffleId, uint baseId, uint toppingId, uint plateId, uint extraId) external competitionIsOngoing waffleExists(waffleId) {
        require(accountOwnsWaffle(msg.sender, waffleId), "You can't bake a layer for a waffle you do not own");
        require(!lastWaffleLayerIsCustomized(waffleId), "You can't add a new layer if the last waffle layer hasn't been customized");

        if(waffles[waffleId].layersCount <= 1) {
            waffles[waffleId].plateId = plateId;
            waffles[waffleId].extraId = extraId;
        }
        uint lastLayerIndex = waffles[waffleId].layersCount - 1;
        waffles[waffleId].layers[lastLayerIndex].baseId = baseId;
        waffles[waffleId].layers[lastLayerIndex].toppingId = toppingId;
        waffles[waffleId].layers[lastLayerIndex].customized = true;
        waffles[waffleId].actionStart = block.timestamp;

        recentWaffles[0] = recentWaffles[1];
        recentWaffles[1] = recentWaffles[2];
        recentWaffles[2] = waffleId;
    }

    function addWaffleIngredient(uint waffleId) external {

    }

    /**
    *   Cast a vote for the waffleId provided from the sender account.
    *
    *   No more than MAX_VOTES_PER_ACCOUNT votes can be cast per account.
    **/
    function voteWaffle(uint waffleId) external competitionIsOngoing waffleExists(waffleId) {
        require(profiles[msg.sender].ownedWafflesCount > 0, "You must create at least one waffle to vote");
        require(profiles[msg.sender].votedWafflesCount < MAX_VOTES_PER_ACCOUNT, "Max votes on this account exceeded");
        require(!accountOwnsWaffle(msg.sender, waffleId), "You can't vote for your own waffle");
        require(!accountHasVotedOnWaffle(msg.sender, waffleId), "You can't vote for the same waffle twice");

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
    function getWaffleInfo(uint waffleId) external view waffleExists(waffleId) returns (address owner, string memory name, string memory description, uint votes, uint plateId, uint extraId, WaffleLayer[] memory layers)  {
        require(waffleId < waffles.length, "This waffle doesn't exist");

        Waffle memory waffle = waffles[waffleId];
        WaffleLayer[] memory waffleLayers = new WaffleLayer[](waffle.layersCount);
        for (uint i = 0; i < waffle.layersCount; i++) {
            waffleLayers[i] = waffles[waffleId].layers[i];
        }
        return (waffle.owner, waffle.name, waffle.description, waffle.votes, waffle.plateId, waffle.extraId, waffleLayers);
    }

    /**
    *   Returns the profile data associated to an address
    **/
    function getProfileInfo(address addr) external view returns (uint[] memory ownedWaffleIds, uint[] memory votedWaffleIds) {
        uint[] memory profileOwnedWaffles = new uint[](profiles[addr].ownedWafflesCount);
        for (uint i = 0; i < profiles[addr].ownedWafflesCount; i++) {
            profileOwnedWaffles[i] = profiles[addr].ownedWaffles[i];
        }

        uint[] memory profileVotedWaffles = new uint[](profiles[addr].votedWafflesCount);
        for (uint i = 0; i < profiles[addr].votedWafflesCount; i++) {
            profileVotedWaffles[i] = profiles[addr].votedWaffles[i];
        }
        return (profileOwnedWaffles, profileVotedWaffles);
    }

    /**
    *   Returns the timestamp at which the competition will end and concludeCompetition()
    *   can be called by anyone to distribute the reward
    **/
    function getCompetitionEndTimestamp() external view returns (uint) {
        return competitionStart + COMPETITION_DURATION;
    }

    // ******************** INTERNAL FUNCTIONS ***********************
    function addWaffleLayer(uint waffleId) internal {
        require(waffles[waffleId].layersCount < MAX_WAFFLE_LAYERS, "You cannot add more layers to this waffle");
        waffles[waffleId].layers[waffles[waffleId].layersCount++] = WaffleLayer(0,0,false);
    }

    function lastWaffleLayerIsCustomized(uint waffleId) internal returns(bool) {
        return waffles[waffleId].layers[waffles[waffleId].layersCount - 1].customized;
    }

    function accountOwnsWaffle(address account, uint waffleId) internal returns(bool) {
        for (uint i = 0; i < profiles[account].ownedWafflesCount; i++) {
            if (profiles[account].ownedWaffles[i] == waffleId) {
                return true;
            }
        }
        return false;
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
