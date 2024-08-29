using Microsoft.EntityFrameworkCore;
using PBLApi.Data;

namespace PBLApi
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.

			builder.Services.AddControllers();

			// Create a reference to the connection string via environment variables
			var connectionString = builder.Configuration.GetConnectionString("PBLContext");

			// Add the database context, connecting with the above connection string
			builder.Services.AddDbContext<PBLContext>(options => options.UseSqlServer(connectionString));


			var app = builder.Build();

			// Configure the HTTP request pipeline.

			app.UseHttpsRedirection();

			app.UseAuthorization();

			app.MapControllers();

			app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000"));

			app.Run();
		}
	}
}