import ironImage from "./assets/img/ranks/Iron.png";
import bronzeImage from "./assets/img/ranks/Bronze.png";
import silverImage from "./assets/img/ranks/Silver.png";
import goldImage from "./assets/img/ranks/Gold.png";
import platinumImage from "./assets/img/ranks/Platinum.png";
import diamondImage from "./assets/img/ranks/Diamond.png";
import masterImage from "./assets/img/ranks/Master.png";
import grandmasterImage from "./assets/img/ranks/Grandmaster.png";
import challengerImage from "./assets/img/ranks/Challenger.png";

export const regions = [
    {regionName: "North America", regionTag: "NA1", regionRoute: "Americas"},
    {regionName: "Middle East", regionTag: "ME1", regionRoute: "Asia"}, 
    {regionName: "Europe West", regionTag: "EUW1", regionRoute: "Europe"}, 
    {regionName: "Europe Nordic & East", regionTag: "EUN1", regionRoute: "Europe"}, 
    {regionName: "Oceania", regionTag: "OC1", regionRoute: "Asia"}, 
    {regionName: "Korea", regionTag: "KR1", regionRoute: "Asia"}, 
    {regionName: "Japan", regionTag: "JP1", regionRoute: "Asia"}, 
    {regionName: "Brazil", regionTag: "BR1", regionRoute: "Americas"}, 
    {regionName: "LAS", regionTag: "LA2", regionRoute: "Americas"}, 
    {regionName: "LAN", regionTag: "LA1", regionRoute: "Americas"}, 
    {regionName: "Russia", regionTag: "RU", regionRoute: "Europe"}, 
    {regionName: "Turkey", regionTag: "TR1", regionRoute: "Asia"}, 
    {regionName: "Singapore", regionTag: "SG2", regionRoute: "Asia"}, 
    {regionName: "Philipines", regionTag: "PH2", regionRoute: "Asia"}, 
    {regionName: "Taiwan", regionTag: "TW2", regionRoute: "Asia"}, 
    {regionName: "Vietnam", regionTag: "VN2", regionRoute: "Asia"}, 
    {regionName: "Thailand", regionTag: "TH2", regionRoute: "Asia"}
];

export const ranks = [
    {tier: "Iron", rankEmbleme: ironImage},
    {tier: "Bronze", rankEmbleme: bronzeImage},
    {tier: "Silver", rankEmbleme: silverImage},
    {tier: "Gold", rankEmbleme: goldImage},
    {tier: "Platinum", rankEmbleme: platinumImage},
    {tier: "Diamond", rankEmbleme: diamondImage},
    {tier: "Master", rankEmbleme: masterImage},
    {tier: "Grandmaster", rankEmbleme: grandmasterImage},
    {tier: "Challenger", rankEmbleme: challengerImage},
];

export const gameModes = [
    {gameMode: "CLASSIC", gameModeName: "Summoner's Rift"},
    {gameMode: "ARAM", gameModeName: "ARAM"},
    {gameMode: "URF", gameModeName: "URF"},
    {gameMode: "ONEFORALL", gameModeName: "One For All"},
    {gameMode: "NEXUSBLITZ", gameModeName: "Nexus Blitz"},
    {gameMode: "TUTORIAL", gameModeName: "Tutorial"},
    {gameMode: "ULTBOOK", gameModeName: "Ultimate Spellbook"},
]

export const gameTypes = [
    {queueId: 0, map: "Custom games", description: "Custom Game"},
    {queueId: 76, map: "Summoner's Rift", description: "Ultra Rapid Fire"},
    {queueId: 400, map: "Summoner's Rift", description: "5v5 Draft Pick"},
    {queueId: 420, map: "Summoner's Rift", description: "Ranked Solo/Duo"},
    {queueId: 430, map: "Summoner's Rift", description: "5v5 Blind Pick"},
    {queueId: 440, map: "Summoner's Rift", description: "5v5 Ranked Flex"},
    {queueId: 450, map: "Howling Abyss", description: "5v5 ARAM"},
    {queueId: 490, map: "Summoner's Rift", description: "Normal (Quickplay)"},
    {queueId: 700, map: "Summoner's Rift", description: "Summoner's Rift Clash"},
    {queueId: 720, map: "Howling Abyss", description: "ARAM Clash"},
    {queueId: 870, map: "Summoner's Rift", description: "Co-op vs. AI Intro Bot"},
    {queueId: 880, map: "Summoner's Rift", description: "Co-op vs. AI Beginner Bot"},
    {queueId: 890, map: "Summoner's Rift", description: "Co-op vs. AI Intermediate Bot"},
    {queueId: 900, map: "Summoner's Rift", description: "ARURF"},
    {queueId: 940, map: "Summoner's Rift", description: "Nexus Siege"},
    {queueId: 1020, map: "Summoner's Rift", description: "One for All"},
    {queueId: 1400, map: "Summoner's Rift", description: "Ultimate Spellbook"},
];
