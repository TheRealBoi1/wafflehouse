pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract WaffleMaker {
    // ******************** CONSTANTS ***********************
    uint constant MAX_WAFFLE_LAYERS = 5;
    uint constant MAX_VOTES_PER_ACCOUNT = 3;
    uint constant COMPETITION_DURATION = 2592000; // 1 month duration

    // ******************** STRUCTS ***********************
    struct WaffleItem {
        string name;
        uint price;
    }

    struct WaffleLayer {
        uint base;
        uint topping;
        bool customized;
    }

    struct Waffle {
        address owner;
        uint votes;
        uint actionStart; // Saves the Unix timestamp at which the either bake or customization worked
        string name;
        string description;
        uint plate;
        uint extra;
        mapping(uint => WaffleLayer) layers;
        uint layersCount;
    }

    struct AccountProfile {
        mapping(uint => uint) ownedWaffles;
        uint ownedWafflesCount;
        mapping(uint => uint) votedWaffles;
        uint votedWafflesCount;
    }

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

    constructor() public{
        admin = msg.sender;
        competitionStart = block.timestamp;

        toppings.push(WaffleItem('Empty', 0));
        bases.push(WaffleItem('Empty', 0));
        plates.push(WaffleItem('Empty', 0));
        extras.push(WaffleItem('Empty', 0));
    }

    // ******************** SEND FUNCTIONS ***********************
    function createWaffle() public {
        require(!competitionHasEnded(), "Cannot create a new waffle after competition has ended");

        waffles.push(Waffle({
            owner: msg.sender,
            votes: 0,
            actionStart: block.timestamp,
            name: "",
            description: "",
            plate: 0,
            extra: 0,
            layersCount: 0
        }));
        addWaffleLayer(waffles.length - 1);

        profiles[msg.sender].ownedWaffles[profiles[msg.sender].ownedWafflesCount++] = waffles.length - 1;
    }

    /**
    *   Add a new layer to the waffleId provided if the waffle is owned by the sender and if last
    *   layer has been customized
    **/
    function bakeWaffleLayer(uint waffleId) public {
        require(!competitionHasEnded(), "You cannot modify a waffle after competition has ended");
        require(waffleExists(waffleId), "This waffle doesn't exist");
        require(accountOwnsWaffle(msg.sender, waffleId), "You can't bake a layer for a waffle you do not own");
        require(lastWaffleLayerIsCustomized(waffleId), "You can't add a new layer if the last waffle layer hasn't been customized");

        addWaffleLayer(waffleId);
    }

    function customizeWaffleLayer(uint waffleId, uint base, uint topping, uint plate, uint extra) public {
        require(!competitionHasEnded(), "You cannot modify a waffle after competition has ended");
        require(waffleExists(waffleId), "This waffle doesn't exist");
        require(accountOwnsWaffle(msg.sender, waffleId), "You can't bake a layer for a waffle you do not own");
        require(!lastWaffleLayerIsCustomized(waffleId), "You can't add a new layer if the last waffle layer hasn't been customized");

        if(waffles[waffleId].layersCount <= 1) {
            waffles[waffleId].plate = plate;
            waffles[waffleId].extra = extra;
        }
        uint lastLayerIndex = waffles[waffleId].layersCount - 1;
        waffles[waffleId].layers[lastLayerIndex].base = base;
        waffles[waffleId].layers[lastLayerIndex].topping = topping;
        waffles[waffleId].layers[lastLayerIndex].customized = true;
        waffles[waffleId].actionStart = block.timestamp;

        recentWaffles[0] = recentWaffles[1];
        recentWaffles[1] = recentWaffles[2];
        recentWaffles[2] = waffleId;
    }

    function addWaffleIngredient(uint waffleId) public {

    }

    /**
    *   Cast a vote for the waffleId provided from the sender account.
    *
    *   No more than MAX_VOTES_PER_ACCOUNT votes can be cast per account.
    **/
    function voteWaffle(uint waffleId) public {
        require(!competitionHasEnded(), "You cannot cast a vote on a waffle after competition has ended");
        require(waffleExists(waffleId), "This waffle doesn't exist");
        require(profiles[msg.sender].ownedWafflesCount > 0, "You must create at least one waffle to vote");
        require(profiles[msg.sender].votedWafflesCount < MAX_VOTES_PER_ACCOUNT, "Max votes on this account exceeded");
        require(!accountOwnsWaffle(msg.sender, waffleId), "You can't vote for your own waffle");
        require(!accountHasVotedOnWaffle(msg.sender, waffleId), "You can't vote for the same waffle twice");

        waffles[waffleId].votes++;
        profiles[msg.sender].votedWaffles[profiles[msg.sender].votedWafflesCount++] = waffleId;
    }

    /**
    *   Call this to conclude the competition and distribute the rewards to the owner
    *   of the waffle with the most votes
    **/
    function concludeCompetition() public {
        require(competitionHasEnded(), "You cannot end the competition before the end timestamp has been crossed");
        require(!competitionConcluded, "Competition has already been concluded");

        competitionConcluded = true;
    }

    // ******************** VIEW FUNCTIONS ***********************
    function getWaffleInfo(uint waffleId) public view returns (address owner, string memory name, string memory description, uint votes, uint plate, uint extra, WaffleLayer[] memory layers) {
        require(waffleId < waffles.length, "This waffle doesn't exist");

        Waffle memory waffle = waffles[waffleId];
        WaffleLayer[] memory waffleLayers = new WaffleLayer[](waffle.layersCount);
        for (uint i = 0; i < waffle.layersCount; i++) {
            waffleLayers[i] = waffles[waffleId].layers[i];
        }
        return (waffle.owner, waffle.name, waffle.description, waffle.votes, waffle.plate, waffle.extra, waffleLayers);
    }

    /**
    *   See the timestamp at which the competition will end and concludeCompetition()
    *   can be called by anyone to distribute the reward
    **/
    function getCompetitionEndTimestamp() public view returns (uint) {
        return competitionStart + COMPETITION_DURATION;
    }

    // ******************** INTERNAL FUNCTIONS ***********************
    function addWaffleLayer(uint waffleId) internal {
        require(waffles[waffleId].layersCount < MAX_WAFFLE_LAYERS, "You cannot add more layers to this waffle");
        waffles[waffleId].layers[waffles[waffleId].layersCount++] = WaffleLayer(0,0,false);
    }

    function waffleExists(uint waffleId) internal returns(bool) {
        return waffleId < waffles.length;
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

    function competitionHasEnded() internal returns (bool) {
        uint endTimestamp = competitionStart + COMPETITION_DURATION;
        return block.timestamp >= endTimestamp;
    }
}
