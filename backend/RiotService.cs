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
        public RiotService(HttpClient httpClient, RiotSettings settings)
        {
            _httpClient = httpClient;
            _settings = settings;
        }
        public void UpdateSettings(RiotSettings settings)
        {
            _settings = settings;
            if (string.IsNullOrEmpty(_settings.TagLine))
            {
                _settings.TagLine = _settings.RegionTag;
            }
        }
        private static JsonNode? GetData(string url, Dictionary<string,string>? queries)
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
            if (!response.IsSuccessful)
            {
                // Handle 404 Not Found error
                throw new InvalidOperationException(nameof(response.StatusCode));
            }
            if (string.IsNullOrEmpty(response.Content))
            {
                throw new InvalidOperationException("Response content is null or empty.");
            }
            return JsonNode.Parse(response.Content);
        }
        private static async Task<JsonNode?> GetDataAsync(string url, Dictionary<string,string>? queries)
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
            var response = await client.ExecuteAsync(request);
            if (string.IsNullOrEmpty(response.Content))
            {
                throw new InvalidOperationException("Response content is null or empty.");
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
            var puuid = summoner.AsObject()["puuid"] ?? throw new ArgumentNullException("PuuID not found in the response.");
            var GameName = summoner.AsObject()["gameName"] ?? throw new ArgumentNullException("GameName not found in the response.");
            if (!string.IsNullOrEmpty(puuid.ToString()) && !string.IsNullOrEmpty(GameName.ToString()))
            {
                _settings.Puuid = puuid.ToString();
                _settings.GameName = GameName.ToString();
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
            var summonerId = accountInfos.AsObject()["id"] ?? throw new ArgumentNullException("Summoner Id not found in the response.");
            var accoundId = accountInfos.AsObject()["accountId"] ?? throw new ArgumentNullException("Summoner Id not found in the response.");
            var profileIconId = accountInfos.AsObject()["profileIconId"] ?? throw new ArgumentNullException("Profile Icon Id not found in the response.");
            var summonerLevel = accountInfos.AsObject()["summonerLevel"]?.GetValue<long>();
            if (!string.IsNullOrEmpty(summonerId.ToString()) && !string.IsNullOrEmpty(accoundId.ToString()))
            {
                _settings.SummonerId = summonerId.ToString();
                _settings.AccountId = accoundId.ToString();
                _settings.ProfileIconId = profileIconId.ToString();
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
        public async Task<JsonNode> GetMatchInfosAsync([FromQuery] string matchId)
        {
            var queries= new Dictionary<string,string>
            {
                {"api_key", apiKey}
            };
            var result = await GetDataAsync($"https://{_settings.Region}.api.riotgames.com/lol/match/v5/matches/{matchId}",queries);
            if (result == null)
            {
                throw new ArgumentNullException(nameof(result));
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
                if (participant == null)
                {
                    throw new ArgumentNullException(nameof(participant));
                }
                var participantData = new JsonObject();
                participantData["teamId"] = participant.AsObject()?["teamId"]?.DeepClone();
                participantData["gameName"] = participant.AsObject()?["riotIdGameName"]?.DeepClone();
                participantData["champLevel"] = participant.AsObject()?["champLevel"]?.DeepClone();
                participantData["championId"]= participant["championId"]?.DeepClone();
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
                damage["totalHealsOnTeammates"] = participant.AsObject()?["totalHealsOnTeammates"]?.DeepClone();
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
                    objects.Add(participant.AsObject()?["item"+i]?.DeepClone());
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
            if (data == null)
            {
                throw new ArgumentNullException(nameof(data));
            }
            JsonObject summonerStats = [];
            JsonArray rankedStats = [];
            foreach(var stats in data.AsArray())
            {
                if (stats == null)
                {
                    throw new ArgumentNullException(nameof(stats));
                }
                JsonObject queue = new()
                {
                    ["queueName"] = stats.AsObject()["queueType"]?.DeepClone(),
                    ["tier"] = stats.AsObject()["tier"]?.DeepClone(),
                    ["rank"] = stats.AsObject()["rank"]?.DeepClone(),
                    ["leaguePoints"] = stats.AsObject()["leaguePoints"]?.DeepClone(),
                    ["wins"] = stats.AsObject()["wins"]?.DeepClone(),
                    ["losses"] = stats.AsObject()["losses"]?.DeepClone(),
                    ["veteran"] = stats.AsObject()["veteran"]?.DeepClone(),
                    ["inactive"] = stats.AsObject()["inactive"]?.DeepClone(),
                    ["freshBlood"] = stats.AsObject()["freshBlood"]?.DeepClone(),
                    ["hotStreak"] = stats.AsObject()["hotStreak"]?.DeepClone()
                };
                rankedStats.Add(queue);
            }
            summonerStats["rankedStats"] = rankedStats;

            JsonObject summonerInfos = new()
            {
                ["profileIconId"] = _settings.ProfileIconId,
                ["summonerLevel"] = _settings.SummonerLevel,
                ["gameName"] = _settings.GameName,
                ["tagLine"] = _settings.TagLine
            };
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
            if (data == null)
            {
                throw new ArgumentNullException(nameof(data));
            }
            var championMastery = new JsonArray();
            foreach(var mastery in data.AsArray())
            {
                if (mastery == null)
                {
                    throw new ArgumentNullException(nameof(mastery));
                }
                JsonObject champion = new()
                {
                    ["championId"] = mastery.AsObject()["championId"]?.DeepClone(),
                    ["championLevel"] = mastery.AsObject()["championLevel"]?.DeepClone(),
                    ["championPoints"] = mastery.AsObject()["championPoints"]?.DeepClone(),
                    ["chestGranted"] = mastery.AsObject()["chestGranted"]?.DeepClone(),
                    ["tokensEarned"] = mastery.AsObject()["tokensEarned"]?.DeepClone(),
                    ["lastPlayTime"] = mastery.AsObject()["lastPlayTime"]?.DeepClone(),
                    ["milestoneGrades"] = mastery.AsObject()["milestoneGrades"]?.DeepClone()
                };
                championMastery.Add(champion);
            }
            return championMastery;
        }
    }
}