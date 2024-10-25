using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using RestSharp;

namespace backend
{
    public class RiotSettings
    {
        public string? SummonerName { get; set; }
        public string? Region { get; set; }
        public string? RegionTag { get; set; }
        public string? TagLine { get; set; }
        public string? Puuid { get; set; }
        public string? GameName { get; set; }
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
        private static JsonNode GetData(string url, Dictionary<string,string> queries)
        {
            var options = new RestClientOptions(url);
            var client = new RestClient(options);
            var request = new RestRequest("");
            foreach (var query in queries)
            {
                request.AddParameter(query.Key, query.Value);
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
            if (string.IsNullOrEmpty(_settings.SummonerName) || string.IsNullOrEmpty(_settings.Region) || string.IsNullOrEmpty(_settings.RegionTag))
            {
                throw new InvalidOperationException("Summoner name and region tag must be set.");
            }
            var queries= new Dictionary<string,string>
            {
                {"api_key", apiKey}
            };
            var tag = _settings.TagLine;
            // Start by getting the puuid and game name
            var summoner = GetData($"https://{_settings.Region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{_settings.SummonerName}/{tag}", queries);
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
            var matchData = GetData($"https://{_settings.Region}.api.riotgames.com/lol/match/v5/matches/{matchId}",queries);
            if (matchData == null)
            {
                throw new ArgumentNullException(nameof(matchData));
            }
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
            var summonerStats=GetData($"https://{_settings.RegionTag}.api.riotgames.com/lol/league/v4/entries/by-summoner/{_settings.SummonerId}",queries);
            if (summonerStats is JsonArray jsonArray && jsonArray.Count > 0)
            {
                summonerStats = summonerStats[0];
            }
            else
            {
                // In the case where the summoner has no ranked stats
                summonerStats = new JsonObject();
            }
            summonerStats["profileIconId"] = _settings.ProfileIconId;
            summonerStats["summonerLevel"] = _settings.SummonerLevel;
            summonerStats["gameName"] = _settings.GameName;
            summonerStats["tagLine"] = _settings.TagLine;
            if (_settings.TagLine != _settings.RegionTag)
            {
                summonerStats["regionTag"] = _settings.RegionTag;
            }
            return summonerStats;
        }
    }
}