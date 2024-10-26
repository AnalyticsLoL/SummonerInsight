using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using System.Globalization;

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
                throw new InvalidOperationException("Summoner name and region tag must be set.");
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
        public string[] GetMatchHistoryGameIds([FromQuery] int? idStartList, [FromQuery] int? idEndList)
        {
            if(string.IsNullOrEmpty(_settings.Region) || string.IsNullOrEmpty(_settings.Puuid))
            {
                throw new InvalidOperationException("Region and the puuid must be set.");
            }
            var queries= new Dictionary<string,string>
            {
                {"api_key", apiKey}
            };
            if(idStartList!=null && idStartList>0 )
            {
                if(idEndList!=null && idStartList<=idEndList)
                {
                    queries.Add("start",idStartList.ToString());
                    queries.Add("count",idEndList.ToString());
                }
                else if(idEndList==null)
                {
                    queries.Add("start",idStartList.ToString());
                }
            }
            else if(idEndList!=null && idEndList>0)
            {
                queries.Add("count",idEndList.ToString());
            }
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
            var matchData = new JsonObject();

            var metadata = new JsonObject();
            metadata["matchId"] = result.AsObject()?["metadata"]?.AsObject()["matchId"]?.DeepClone();
            metadata["participantsPuuId"] = result.AsObject()?["metadata"]?.AsObject()?["participants"]?.AsArray().DeepClone();
            metadata["gameDuration"] = result.AsObject()?["info"]?.AsObject()["gameDuration"]?.DeepClone();
            metadata["gameStart"] = result.AsObject()?["info"]?["gameStartTimestamp"]?.DeepClone();
            metadata["gameMode"] = result.AsObject()?["info"]?["gameMode"]?.DeepClone();
            matchData["metadata"] = metadata;

            var participants = new JsonArray();
            var participantsArray = result.AsObject()?["info"]?["participants"]?.AsArray();
            if (participantsArray == null)
            {
                throw new InvalidOperationException("Participants data not found in the response.");
            }
            foreach (var participant in participantsArray)
            {
                var participantData = new JsonObject();
                participantData["teamId"] = participant.AsObject()?["teamId"]?.DeepClone();
                participantData["championName"] = participant.AsObject()?["championName"]?.DeepClone();
                TextInfo textInfo = new CultureInfo("en-US", false).TextInfo;

                // Some champion names are not correctly formatted for the image icons url
                var erroneousChampionUrls = new[] { "FiddleSticks" };
                var championName = participant.AsObject()?["championName"]?.ToString();
                if (championName != null && erroneousChampionUrls.Contains(championName))
                {
                    participantData["championIcon"] = "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/" + textInfo.ToTitleCase(championName) + ".png";
                }
                else
                {
                    participantData["championIcon"] = "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/" + championName + ".png";
                };
                participantData["gameName"] = participant.AsObject()?["riotIdGameName"]?.DeepClone();
                participantData["champLevel"] = participant.AsObject()?["champLevel"]?.DeepClone();
                participantData["championId"] = participant.AsObject()?["championId"]?.DeepClone();
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
                participantData["kda"] = kda;

                var objects = new JsonArray();
                for(int i=0;i<7;i++)
                {   
                    var item = new JsonObject();
                    item["itemId"] = participant.AsObject()?["item"+i]?.DeepClone();
                    item["itemIcon"] = "https://ddragon.leagueoflegends.com/cdn/14.21.1/img/item/"+item["itemId"]+".png";
                    objects.Add(item);
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
    }
}