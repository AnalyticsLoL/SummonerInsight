using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using System.Globalization;
using System.Text.Json;

namespace backend
{
    public class RiotSettings
    {
        public string? GameName { get; set; }
        public string? Region { get; set; }
        public string? RegionTag { get; set; }
        public string? TagLine { get; set; }
        public string? Puuid { get; set; }
        public string? AccountId { get; set; }
        public string? SummonerId { get; set; }
        public string? ProfileIconId { get; set; }
        public long? SummonerLevel { get; set; }
    }
    public class RiotService
    {
        private readonly HttpClient _httpClient;
        public RiotSettings _settings;
        private static readonly string apiKey = new ApiKey().key;
        private static Dictionary<string, JsonNode> _championCache = new Dictionary<string, JsonNode>();
        public RiotService(HttpClient httpClient, RiotSettings settings)
        {
            _httpClient = httpClient;
            _settings = settings;
        }
        public void LoadChampionData()
        {
            var json = File.ReadAllText("data/champion.json");
            var doc = JsonNode.Parse(json) as JsonObject ?? throw new InvalidOperationException("Failed to parse JSON.");
            var data = doc["data"] as JsonObject ?? throw new InvalidOperationException("Data not found in JSON.");

            _championCache.Clear();
            foreach (var property in data)
            {
                var item = property.Value as JsonObject;

                // Cache the item if it has a "key" property
                if (item != null && item.TryGetPropertyValue("key", out var keyElement))
                {
                    var key = keyElement?.ToString();
                    if (!string.IsNullOrEmpty(key))
                    {
                        _championCache[key] = item;
                    }
                }
            }
        }
        private static Dictionary<string, JsonNode> _itemCache = new Dictionary<string, JsonNode>();
        public void LoadItemData()
        {
            var json = File.ReadAllText("data/item.json");
            var doc = JsonNode.Parse(json) as JsonObject ?? throw new InvalidOperationException("Failed to parse JSON.");
            var data = doc["data"] as JsonObject ?? throw new InvalidOperationException("Data not found in JSON.");

            _itemCache.Clear();
            foreach (var property in data)
            {
                _itemCache[property.Key] = property.Value;
                _itemCache[property.Key]["id"] = property.Key;
            }
        }

        public void UpdateSettings(RiotSettings settings)
        {
            _settings = settings;
            if (string.IsNullOrEmpty(_settings.TagLine))
            {
                _settings.TagLine = _settings.RegionTag;
            }
        }
        private static JsonNode GetData(string url, Dictionary<string,string>? queries)
        {
            var options = new RestClientOptions(url);
            var client = new RestClient(options);
            var request = new RestRequest("");
            if (queries != null)
            {
                foreach (var query in queries)
                {
                    request.AddParameter(query.Key, query.Value);
                }
            }
            Console.WriteLine("Sending request to :"+url);
            var response = client.Execute(request);
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                // Handle 404 Not Found error
                throw new InvalidOperationException("404 Not Found");
            }
            else if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                // Handle other non-OK status codes
                throw new InvalidOperationException("Error: "+response.StatusCode);
            }
            return JsonNode.Parse(response.Content);
        }
        public backend.RiotSettings GetSummonerPuuID_GameName_ProfileIcon_Level()
        {
            if (string.IsNullOrEmpty(_settings.GameName) || string.IsNullOrEmpty(_settings.Region) || string.IsNullOrEmpty(_settings.RegionTag))
            {
                throw new InvalidOperationException("Game name, region tag and region must be set.");
            }
            var queries= new Dictionary<string,string>
            {
                {"api_key", apiKey}
            };
            var tag = _settings.TagLine;
            // Start by getting the puuid and game name
            var summoner = GetData($"https://{_settings.Region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{_settings.GameName}/{tag}", queries);
            if (summoner == null)
            {
                throw new ArgumentNullException(nameof(summoner));
            }
            var puuid = summoner.AsObject()["puuid"].ToString();
            var GameName = summoner.AsObject()["gameName"].ToString();
            if (!string.IsNullOrEmpty(puuid) && !string.IsNullOrEmpty(GameName))
            {
                _settings.Puuid = puuid;
                _settings.GameName = GameName;
            }
            else
            {
                throw new InvalidOperationException("Puuid or Game Name not found in the response.");
            }
            return _settings;            
        }
        public backend.RiotSettings GetSummonerAccount_SummonerID()
        {
            if (string.IsNullOrEmpty(_settings.Puuid) || string.IsNullOrEmpty(_settings.RegionTag))
            {
                throw new InvalidOperationException("PuuID and region tag must be set.");
            }
            var queries= new Dictionary<string,string>
            {
                {"api_key", apiKey}
            };
            var accountInfos = GetData($"https://{_settings.RegionTag}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{_settings.Puuid}",queries);
            if (accountInfos == null)
            {
                throw new ArgumentNullException(nameof(accountInfos));
            }
            string summonerId = accountInfos.AsObject()["id"].ToString();
            string accoundId = accountInfos.AsObject()["accountId"].ToString();
            var profileIconId = accountInfos.AsObject()["profileIconId"]?.ToString();
            var summonerLevel = accountInfos.AsObject()["summonerLevel"]?.GetValue<long>();
            if (!string.IsNullOrEmpty(summonerId) && !string.IsNullOrEmpty(accoundId))
            {
                _settings.SummonerId = summonerId;
                _settings.AccountId = accoundId;
                _settings.ProfileIconId = "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/profileicon/"+profileIconId+".png";
                _settings.SummonerLevel = summonerLevel;
            }
            else
            {
                throw new InvalidOperationException("Summoner Id or Account Id not found in the response.");
            }
            return _settings;
        }
        public string[] GetMatchHistoryGameIds([FromQuery] int? idStartList, [FromQuery] int? idCount)
        {
            if(string.IsNullOrEmpty(_settings.Region) || string.IsNullOrEmpty(_settings.Puuid))
            {
                throw new InvalidOperationException("Region and the puuid must be set.");
            }
            var queries = new Dictionary<string, string>
            {
                {"api_key", apiKey},
                {"start", idStartList?.ToString() ?? "0"},
                {"count", idCount?.ToString() ?? "0"}
            };
            var matchIds = GetData($"https://{_settings.Region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{_settings.Puuid}/ids",queries);
            if (matchIds == null)
            {
                throw new ArgumentNullException(nameof(matchIds));
            }

            //Convert the JsonNode output to a string array
            string[] matchIdsArray = matchIds.AsArray().Select(node => node.GetValue<string>()).ToArray();
            return matchIdsArray;
        }
        public JsonNode GetMatchInfos([FromQuery] string matchId)
        {
            if(string.IsNullOrEmpty(_settings.Region))
            {
                throw new InvalidOperationException("Region must be set.");
            }
            var queries= new Dictionary<string,string>
            {
                {"api_key", apiKey}
            };
            var result = GetData($"https://{_settings.Region}.api.riotgames.com/lol/match/v5/matches/{matchId}",queries);
            if (result == null)
            {
                throw new ArgumentNullException(nameof(result));
            }
            if (_championCache.Count == 0)
            {
                LoadChampionData();
            }
            if (_itemCache.Count == 0)
            {
                LoadItemData();
            }
            var matchData = new JsonObject();

            var metadata = new JsonObject();
            metadata["matchId"] = result.AsObject()?["metadata"]?.AsObject()["matchId"]?.DeepClone();
            metadata["participantsPuuId"] = result.AsObject()?["metadata"]?.AsObject()?["participants"]?.AsArray().DeepClone();
            metadata["gameDuration"] = result.AsObject()?["info"]?.AsObject()["gameDuration"]?.DeepClone();
            metadata["gameStart"] = result.AsObject()?["info"]?["gameStartTimestamp"]?.DeepClone();
            metadata["gameMode"] = result.AsObject()?["info"]?["gameMode"]?.DeepClone();
            metadata["gameTypeId"] = result.AsObject()?["info"]?["queueId"]?.DeepClone();
            matchData["metadata"] = metadata;

            var participants = new JsonArray();
            var participantsArray = (result.AsObject()?["info"]?["participants"]?.AsArray()) ?? throw new InvalidOperationException("Participants data not found in the response.");
            foreach (var participant in participantsArray)
            {
                var participantData = new JsonObject();
                participantData["teamId"] = participant.AsObject()?["teamId"]?.DeepClone();
                participantData["gameName"] = participant.AsObject()?["riotIdGameName"]?.DeepClone();
                participantData["champLevel"] = participant.AsObject()?["champLevel"]?.DeepClone();
                if (!string.IsNullOrEmpty(participant["championId"]?.ToString()) && _championCache.TryGetValue(participant["championId"]?.ToString(), out var champion))
                {
                    participantData["champion"]= champion?.DeepClone();
                }
                participantData["tagLine"] = participant.AsObject()?["riotIdTagline"]?.DeepClone();
                participantData["puuid"] = participant.AsObject()?["puuid"]?.DeepClone();
                participantData["teamId"] = participant.AsObject()?["teamId"]?.DeepClone();
                participantData["win"] = participant.AsObject()?["win"]?.DeepClone();
                participantData["position"]= participant.AsObject()?["teamPosition"]?.DeepClone();
                participantData["doubleKill"] = participant.AsObject()?["doubleKills"]?.GetValue<int>() != 0;
                participantData["tripleKill"] = participant.AsObject()?["tripleKills"]?.GetValue<int>() != 0;
                participantData["quadraKill"] = participant.AsObject()?["quadraKills"]?.GetValue<int>() != 0;
                participantData["pentakill"] = participant.AsObject()?["pentaKills"]?.GetValue<int>() != 0;
                participantData["firstBlood"] = participant.AsObject()?["firstBloodKill"]?.DeepClone();
                participantData["firstTower"] = participant.AsObject()?["firstTowerKill"]?.DeepClone();

                var damage = new JsonObject();
                damage["totalDamageDealtToChampions"] = participant.AsObject()?["totalDamageDealtToChampions"]?.DeepClone();
                damage["totalDamageTaken"] = participant.AsObject()?["totalDamageTaken"]?.DeepClone();
                participantData["damage"] = damage;

                var vision = new JsonObject();
                vision["visionScore"] = participant.AsObject()?["visionScore"]?.DeepClone();
                vision["wardsPlaced"] = participant.AsObject()?["wardsPlaced"]?.DeepClone();
                vision["wardsKilled"] = participant.AsObject()?["wardsKilled"]?.DeepClone();
                vision["controlWardsPlaced"] = participant.AsObject()?["controlWardsPlaced"]?.DeepClone();
                participantData["vision"] = vision;

                var gold = new JsonObject();
                gold["totalMinionsKilled"] = participant.AsObject()?["totalMinionsKilled"]?.DeepClone();
                gold["csPerMinute"] = gold["totalMinionsKilled"]?.GetValue<float>() / (metadata["gameDuration"]?.GetValue<float>() / 60);
                gold["goldEarned"] = participant.AsObject()?["goldEarned"]?.DeepClone();
                gold["goldPerMinute"] = participant.AsObject()?["challenges"]?.AsObject()["goldPerMinute"]?.DeepClone();
                participantData["gold"] = gold;

                var kda = new JsonObject();
                kda["kills"] = participant.AsObject()?["kills"]?.DeepClone();
                kda["deaths"] = participant.AsObject()?["deaths"]?.DeepClone();
                kda["assists"] = participant.AsObject()?["assists"]?.DeepClone();
                if(kda["deaths"]?.GetValue<float>() == 0)
                {
                    kda["kda"] = kda["kills"]?.GetValue<float>() + kda["assists"]?.GetValue<float>();
                }
                else
                {
                    kda["kda"] = (kda["kills"]?.GetValue<float>() + kda["assists"]?.GetValue<float>()) / kda["deaths"]?.GetValue<float>();
                }    
                participantData["kda"] = kda;

                var objects = new JsonArray();
                for(int i=0;i<7;i++)
                {   
                    var itemKey = participant.AsObject()?["item"+i]?.ToString();
                    if (!string.IsNullOrEmpty(itemKey) && _itemCache.TryGetValue(itemKey, out var item))
                    {
                        objects.Add(item?.DeepClone());
                    }
                }
                participantData["items"] = objects;

                participants.Add(participantData);
            }
            matchData["participants"] = participants;
            return matchData;
        }
        public JsonNode GetSummonerInfos()
        {
            if(string.IsNullOrEmpty(_settings.SummonerId)|| string.IsNullOrEmpty(_settings.RegionTag))
            {
                throw new InvalidOperationException("SummonerId must be set.");
            }
            var queries= new Dictionary<string,string>
            {
                {"api_key", apiKey}
            };
            var data=GetData($"https://{_settings.RegionTag}.api.riotgames.com/lol/league/v4/entries/by-summoner/{_settings.SummonerId}",queries);
            
            var summonerStats = new JsonObject();
            var rankedStats = new JsonArray();
            foreach(var stats in data.AsArray())
            {
                var queue = new JsonObject();
                queue["queueName"] = stats.AsObject()["queueType"]?.DeepClone();
                queue["tier"] = stats.AsObject()["tier"]?.DeepClone();
                queue["rank"] = stats.AsObject()["rank"]?.DeepClone();
                queue["leaguePoints"] = stats.AsObject()["leaguePoints"]?.DeepClone();
                queue["wins"] = stats.AsObject()["wins"]?.DeepClone();
                queue["losses"] = stats.AsObject()["losses"]?.DeepClone();
                queue["veteran"] = stats.AsObject()["veteran"]?.DeepClone();
                queue["inactive"] = stats.AsObject()["inactive"]?.DeepClone();
                queue["freshBlood"] = stats.AsObject()["freshBlood"]?.DeepClone();
                queue["hotStreak"] = stats.AsObject()["hotStreak"]?.DeepClone();
                rankedStats.Add(queue);
            }
            summonerStats["rankedStats"] = rankedStats;

            var summonerInfos = new JsonObject();
            summonerInfos["profileIconId"] = _settings.ProfileIconId;
            summonerInfos["summonerLevel"] = _settings.SummonerLevel;
            summonerInfos["gameName"] = _settings.GameName;
            summonerInfos["tagLine"] = _settings.TagLine;
            if (_settings.TagLine != _settings.RegionTag)
            {
                summonerInfos["regionTag"] = _settings.RegionTag;
            }
            summonerStats["summonerProfile"] = summonerInfos;
            
            return summonerStats;
        }
        public JsonNode GetChampionMastery()
        {
            if(string.IsNullOrEmpty(_settings.SummonerId)|| string.IsNullOrEmpty(_settings.RegionTag))
            {
                throw new InvalidOperationException("SummonerId must be set.");
            }
            var queries= new Dictionary<string,string>
            {
                {"api_key", apiKey}
            };
            var data=GetData($"https://{_settings.RegionTag}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{_settings.Puuid}/top",queries);
            LoadChampionData();
            var championMastery = new JsonArray();
            foreach(var mastery in data.AsArray())
            {
                var champion = new JsonObject();
                if (_championCache.TryGetValue(mastery.AsObject()["championId"]?.ToString(), out var championData))
                {
                    champion["championName"] = championData["name"]?.DeepClone();
                    champion["championIcon"] = "https://ddragon.leagueoflegends.com/cdn/11.20.1/img/champion/" + championData["id"] + ".png";
                }
                champion["championId"] = mastery.AsObject()["championId"]?.DeepClone();
                champion["championLevel"] = mastery.AsObject()["championLevel"]?.DeepClone();
                champion["championPoints"] = mastery.AsObject()["championPoints"]?.DeepClone();
                champion["chestGranted"] = mastery.AsObject()["chestGranted"]?.DeepClone();
                champion["tokensEarned"] = mastery.AsObject()["tokensEarned"]?.DeepClone();
                champion["lastPlayTime"] = mastery.AsObject()["lastPlayTime"]?.DeepClone();
                champion["milestoneGrades"] = mastery.AsObject()["milestoneGrades"]?.DeepClone();

                championMastery.Add(champion);
            }
            return championMastery;
        }
    }
}