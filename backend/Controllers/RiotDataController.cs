using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RiotDataController : ControllerBase
    {
        private readonly RiotService _riotService;

        public RiotDataController(RiotService riotService)
        {
            _riotService = riotService;
        }
        [HttpPost("settings")]
        public IActionResult UpdateSettings([FromBody] RiotSettings settings)
        {
            if (settings == null)
            {
                return BadRequest("Settings cannot be null.");
            }
            // Update RiotService with new settings
            _riotService.UpdateSettings(settings);
            _riotService.GetSummonerPuuID_GameName_ProfileIcon_Level();
            _riotService.GetSummonerAccount_SummonerID();

            return Ok(_riotService._settings);
        }
        [HttpPost("matchhistory")]
        public async Task<IActionResult> GetPlayerMatchHistory([FromBody] RiotSettings settings, [FromQuery] int? idStartList, [FromQuery] int? idCount)
        {
            _riotService.UpdateSettings(settings);
            _riotService.GetSummonerPuuID_GameName_ProfileIcon_Level();

            // Retrieve match IDs for the player
            var matchIds = _riotService.GetMatchHistoryGameIds(idStartList, idCount);
            
            // Retrieve match information for each match ID
            var matchInfosTasks = matchIds.Select(async matchId =>
            {
                try
                {
                    var matchInfo = await _riotService.GetMatchInfosAsync(matchId);
                    if (matchInfo != null)
                    {
                        return matchInfo;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Error retrieving match info for match ID {matchId}: {e.Message}");
                }
                return null;
            }).ToList();

            try 
            {
                var matchInfos = await Task.WhenAll(matchInfosTasks);
                var validMatchInfos = matchInfos.Where(info => info != null).ToList();
                return Ok(validMatchInfos);
            }
            catch (Exception e)
            {
                // Handle any errors from any of the requests
                Console.WriteLine(e.Message);
                return StatusCode(500, "Error retrieving match information");
            }
        } 
        [HttpPost("summonerInfo")]
        public IActionResult GetSummonerInfos([FromBody] RiotSettings settings)
        {
            _riotService.UpdateSettings(settings);
            _riotService.GetSummonerPuuID_GameName_ProfileIcon_Level();
            _riotService.GetSummonerAccount_SummonerID();
            
            var summonerInfos = _riotService.GetSummonerInfos();
            summonerInfos["championMastery"]=_riotService.GetChampionMastery();

            return Ok(summonerInfos);
        } 
    }
}