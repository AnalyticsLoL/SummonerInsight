# SummonerInsight
Website showing users and champion data of League of Legends

## Ideas for next stuff
- [ ] Finish to implement abortion when changing page while loading
- [ ] Filter matchhistory by queuetype and gamemode
- [ ] Make dark mode and day mode pages using css var
- [ ] Add tags with First Blood, First Tower etc...

## Feedbacks
- Team Summoner names two columns take too much space
- Add skins in game
- Add a more general season/split statistique section with draft/aram...
- Add live games options
- Use i18next for multiple languages support
- Win prediction
- Mobile app
- match blocks take too much space, should be smaller and ouvrable to allow users to see more than 3 games at once
- teams player names too big, and too much spacing
- champion icon too big
- Add icons from the game for hp, gold, ap, ad, etc...
- Add cookies (detect region of the user)
- Add 3-5 user names of friend recently played with (when on same team, person appears more than twice) and add the winrate
- User has a scrolldown arrow appearing in the navbar searchbar
- Add mastery champions kda and and winrate
- add in matches graphs of the gold and and events like deaths and kills, objectives ...

## Win prediction notes
By using an encoder only transformer like BERT, there are 252 tokens vaocabulary:

- 164 champions +
- 27 ranks +
- 5 positions +
- 50 runes (5 trees * 9 runes + 9 stats runes)
- =252 dataset size

Chinchilla article says that compute optimal models takes 20x more dataset size than parameters. This isn't possible here but still mean a low number of parameters.
