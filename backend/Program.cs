using backend;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddUserSecrets<Program>();
Console.WriteLine("RiotApiKey: " + builder.Configuration["RiotApiKey"]); // Debugging line

builder.Services.AddSingleton<RiotService>();

// Register services
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "http://192.168.2.34:3000") // Allow only the React app's URL
               .AllowAnyMethod() // Allow any HTTP method (GET, POST, etc.)
               .AllowAnyHeader(); // Allow any header
    });
});

// Register RiotSettings as a singleton
builder.Services.AddSingleton<RiotSettings>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();