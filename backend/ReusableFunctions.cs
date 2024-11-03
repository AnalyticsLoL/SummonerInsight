using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;

namespace backend
{
    public class ReusableFunctions
    {
        public JsonObject ParseDescriptionToJson(string description)
        {
            var result = new JsonObject();
            var stats = new JsonObject();
            var passives = new JsonArray();
            var actives = new JsonArray();

            // Match statistics
            var statMatches = Regex.Matches(description, @"<stats>(.*?)<\/stats>", RegexOptions.Singleline);
            foreach (Match statMatch in statMatches)
            {
                var statText = statMatch.Groups[1].Value;
                var statLines = statText.Split(new[] { "<br>" }, StringSplitOptions.RemoveEmptyEntries);
                
                foreach (var line in statLines)
                {
                    // Extract attention value and text (e.g., "110 Health")
                    var attentionMatch = Regex.Match(line, @"<attention>(?<value>[\d]+)<\/attention>\s*(?<text>.+)");
                    if (attentionMatch.Success)
                    {
                        string value = attentionMatch.Groups["value"].Value;
                        string text = attentionMatch.Groups["text"].Value.Trim();

                        // Normalize key (e.g., "health" from "Health")
                        string key = text.ToLower(); // Use the text as-is, may want to clean it up further
                        stats[key] = double.TryParse(value, out double numericValue) ? numericValue : value;
                    }
                }
            }

            // Match passive abilities
            var passivePattern = @"<passive>(?<name>.*?)<\/passive>\s*<br>(?<desc>.*?)(?=<br><br>|$)";
            var passiveMatches = Regex.Matches(description, passivePattern, RegexOptions.Singleline);

            foreach (Match passiveMatch in passiveMatches)
            {
                var name = passiveMatch.Groups["name"].Value.Trim();
                var descriptionText = passiveMatch.Groups["desc"].Value.Trim();

                // Remove HTML tags from descriptionText
                descriptionText = Regex.Replace(descriptionText, @"<[^>]*>", "");

                // Add the passive to the array
                passives.Add(new JsonObject
                {
                    ["name"] = name,
                    ["description"] = descriptionText
                });
            }

            // Match active abilities
            var activePattern = @"<active>(?<name>.*?)<\/active>\s*<br>(?<desc>.*?)(?=<br><br>|$)";
            var activeMatches = Regex.Matches(description, activePattern, RegexOptions.Singleline);

            foreach (Match activeMatch in activeMatches)
            {
                var name = activeMatch.Groups["name"].Value.Trim();
                var descriptionText = activeMatch.Groups["desc"].Value.Trim();

                // Remove HTML tags from descriptionText
                descriptionText = Regex.Replace(descriptionText, @"<[^>]*>", "");

                // Add the passive to the array
                actives.Add(new JsonObject
                {
                    ["name"] = name,
                    ["description"] = descriptionText
                });
            }

            // Assemble the final result
            result["stats"] = stats;
            result["passive"] = passives;
            result["active"] = actives;

            return result;
        }
    }
}