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
        public IActionResult GetPlayerMatchHistory([FromBody] RiotSettings? settings, [FromQuery] int? idStartList, [FromQuery] int? idEndList)
        {
            if (settings != null)
            {
                _riotService.UpdateSettings(settings);
                _riotService.GetSummonerPuuID_GameName_ProfileIcon_Level();
                _riotService.GetSummonerAccount_SummonerID();
            }
            if (idStartList == null || idEndList == null)
            {
                idStartList = 0;
                idEndList = 1;
            }
            var matchIds = _riotService.GetMatchHistoryGameIds(idStartList, idEndList);
            var matchInfos = new List<object>();
            foreach (var matchId in matchIds)
            {
                matchInfos.Add(_riotService.GetMatchInfos(matchId));
            }
            return Ok(matchInfos);
        } 
        [HttpPost("summonerInfo")]
        public IActionResult GetSummonerInfos([FromBody] RiotSettings? settings)
        {
            if (settings != null)
            {
                _riotService.UpdateSettings(settings);
                _riotService.GetSummonerPuuID_GameName_ProfileIcon_Level();
                _riotService.GetSummonerAccount_SummonerID();
            }
            var summonerInfos = _riotService.GetSummonerInfos();
            return Ok(summonerInfos);
        } 
    }
}