using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace PBLApi.Models
{
	/// <summary>
	/// Primary data entity, a book has the expected properties (author, genre, etc). 
	/// </summary>
	public class Book
	{
		/// <summary>
		/// Unique identifier for book
		/// </summary>
		[Key]
		public Guid Id { get; set; }
		/// <summary>
		/// Title of the book
		/// </summary>
		[Required]
		public required string Title { get; set; }
		/// <summary>
		/// Brief description of the plot
		/// </summary>
		public string? Synopsis { get; set; }
		/// <summary>
		/// Author of the book
		/// </summary>
		public string? Author { get; set; }
		/// <summary>
		/// Published year
		/// </summary>
		public string? Year { get; set; }
		/// <summary>
		/// What genre the book falls under
		/// </summary>
		public string? Genre { get; set; }
		/// <summary>
		/// ISBN identifier
		/// </summary>
		public string? ISBN { get; set; }
		/// <summary>
		/// Base64 image of cover
		/// </summary>
		public string? Cover { get; set; }
		/// <summary>
		/// Is the book fiction or non-fiction
		/// </summary>
		public bool? Fiction { get; set; }
		/// <summary>
		/// How many pages the book has
		/// </summary>
		public int? PageCount { get; set; }
	}
}
