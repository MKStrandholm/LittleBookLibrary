using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PBLApi.Data;
using PBLApi.Models;

namespace PBLApi.Controllers
{
	[Route("[controller]")]
	[ApiController]
	public class BookController : ControllerBase
	{

		private readonly PBLContext _context;

		public BookController(PBLContext context)
		{
			_context = context;
		}

		/// <summary>
		/// Gets all books
		/// </summary>
		/// <returns>List of all books</returns>
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Book>>> GetBooksAsync()
		{
			// Null check for table
			if (_context.Book == null)
			{
				return NotFound();
			}

			return await _context.Book.ToListAsync();
		}

		/// <summary>
		/// Get book by ID
		/// </summary>
		/// <param name="id">Book entity ID</param>
		/// <returns>Book entity matching the provided ID</returns>
		[HttpGet("/details/{id}")]
		public async Task<ActionResult<Book>> GetBook(Guid id)
		{
			// Null check for table
			if (_context.Book == null)
			{
				return NotFound();
			}

			// Attempt to grab book with ID
			var book = _context.Book.Find(id);

			// Null check for entity
			if (book == null)
			{
				return NotFound();
			}
            
            return await _context.Book.Where(b => b.Id == id).FirstOrDefaultAsync();
		}

		/// <summary>
		/// Get all categories associated with a book using book ID
		/// </summary>
		/// <param name="id">Book entity ID</param>
		/// <returns>List of categories attached to provided book</returns>
		[HttpGet("/bookCategories/{id}")]
		public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesByBookAsync(Guid id)
		{
			// Null check for tables
			if (_context.Category == null || _context.Book == null || _context.CategoryBookJunction == null)
			{
				return NotFound();
			}

			// Attempt to grab category with ID
			var book = _context.Book.Find(id);

			// Null check for entity
			if (book == null)
			{
				return NotFound();
			}

			// Grab an enumerable list of categories that belong to the book
			IEnumerable<Category> catEnum = from c in _context.Category
										 join cbj in _context.CategoryBookJunction on c.Id equals cbj.CategoryId
										 join b in _context.Book on cbj.BookId equals book.Id
										 select c;

			// Filter to distinct values and cast as array
			Category[] cats = catEnum.Distinct().ToArray();

			return Ok(cats);
		}

		/// <summary>
		/// Performs a search on books using a search type and value
		/// </summary>
		/// <param name="searchBy">Field to search on</param>
		/// <param name="searchValue">Value to search for</param>
		/// <returns>List of books matching the search criteria</returns>
		[HttpGet("/{searchBy}/{searchValue}")]
		
		public async Task<IEnumerable<JointCategoryWithBooks>> SearchBookAsync(string searchBy, string searchValue)
		{
			// Null check for table
			if (_context.Book == null)
			{
				return (IEnumerable<JointCategoryWithBooks>)NotFound();
			}


			List<Book> books = await _context.Book.ToListAsync();

			List<JointCategoryWithBooks> finals = new();

			foreach (Book book in books)
			{
				finals.Add(new JointCategoryWithBooks
				{
					JointBook = book,
					Categories = (from c in _context.Category
								  join cbj in _context.CategoryBookJunction on c.Id equals cbj.CategoryId
								  join b in _context.Book on cbj.BookId equals book.Id
								  select c).Distinct().ToArray()
				});
			}

			// Only search by possible types
			switch (searchBy)
			{
				case "title":
					return finals.Where(f => f.JointBook.Title.ToLower().Contains(searchValue.ToLower()));
				case "author":
					return finals.Where(f => f.JointBook.Author != null && f.JointBook.Author.ToLower().Contains(searchValue.ToLower()));
				case "year":
					return finals.Where(f => f.JointBook.Year != null && f.JointBook.Year.ToLower().Contains(searchValue.ToLower()));
				case "genre":
					return finals.Where(f => f.JointBook.Genre != null && f.JointBook.Genre.ToLower().Contains(searchValue.ToLower()));
				case "isbn":
					return finals.Where(f => f.JointBook.ISBN != null && f.JointBook.ISBN.ToLower().Contains(searchValue.ToLower()));
				default:
					return finals;
			}
		}

		/// <summary>
		/// Creates a new book
		/// </summary>
		/// <param name="model">Book model sent from front-end JSON</param>
		/// <returns>Created at action response (201)</returns>
		[HttpPost]
		public async Task<ActionResult<Book>> CreateBook([FromBody] Book model)
		{
			// Null check for table
			if (_context.Book == null)
			{
				return NotFound();
			}

			// Add book
			_context.Book.Add(model);
			await _context.SaveChangesAsync();
			
			return CreatedAtAction(nameof(GetBook), new { id = model.Id }, model);
		}

		/// <summary>
		/// Updates a book by ID
		/// </summary>
		/// <param name="id">Book entity ID</param>
		/// <param name="model">Book model sent from front-end JSON</param>
		/// <returns>OK (200)</returns>
		/// <exception cref="DbUpdateConcurrencyException"></exception>
		[HttpPut("{id}")]
		public async Task<ActionResult<Book>> UpdateBook(Guid id, Book model)
		{
			// Check that ID matches
			if (id != model.Id)
			{
				return BadRequest();
			}

			_context.Entry(model).State = EntityState.Modified;

			// Attempt to save changes
			try
			{
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				throw new DbUpdateConcurrencyException(ex.ToString());
			}

			return Ok();
		}

		/// <summary>
		/// Deletes a book
		/// </summary>
		/// <param name="id">Book entity ID</param>
		/// <returns>OK (200)</returns>
		[HttpDelete("{id}")]
		public async Task<ActionResult<Book>> DeleteBook(Guid id)
		{
			// Null check for table
			if (_context.Book == null)
			{
				return NotFound();
			}

			// Attempt to grab book with ID
			var book = await _context.Book.FindAsync(id);

			// Null check for entity
			if (book == null)
			{
				return NotFound();
			}

			// Remove item from table
			_context.Book.Remove(book);
			await _context.SaveChangesAsync();

			return Ok();
		}
	}
}
