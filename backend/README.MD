# Backend

To run the app, go to the folder backend and `dotnet run`

To see the big picture of what you can do with this application, run the app and go to
![http://127.0.0.1:5151/swagger/index.html](http://127.0.0.1:5151/swagger/index.html)

**MANDATORY**: Add your Riot Api Key as such:
```
dotnet user-secrets init
dotnet user-secrets set "RiotApiKey" "your-api-key-here"
```