using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PBLApi.Data;
using PBLApi.Models;

namespace PBLApi.Controllers
{
	[Route("[controller]")]
	[ApiController]
	public class CategoryController : ControllerBase
	{
		private readonly PBLContext _context;

		public CategoryController(PBLContext context)
		{
			_context = context;
		}

		/// <summary>
		/// Gets all categories
		/// </summary>
		/// <returns>List of categories</returns>
		[HttpGet("/categories")]
		public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesAsync()
		{
			// Null check for table
			if (_context.Category == null)
			{
				return NotFound();
			}

			return await _context.Category.ToListAsync();
		}

		/// <summary>
		/// Gets a category by its ID
		/// </summary>
		/// <param name="id">Category entity ID</param>
		/// <returns>Category entity object matching the provided ID</returns>
		[HttpGet("{id}")]
		public async Task<ActionResult<Category>> GetCategory(Guid id)
		{
			// Null check for table
			if (_context.Category == null)
			{
				return NotFound();
			}

			// Attempt to grab category with ID
			var cat = _context.Category.Find(id);

			// Null check for entity
			if (cat == null)
			{
				return NotFound();
			}

			return await _context.Category.Where(c => c.Id == id).FirstOrDefaultAsync();
		}

		/// <summary>
		/// Gets details of a category (for supplying to book struct on front-end)
		/// </summary>
		/// <param name="id">Category entity ID</param>
		/// <returns>Category object matching the provided ID</returns>
		[HttpGet("/category/details/{id}")]
		public async Task<ActionResult<Category>> GetCategoryDetailsAsync(Guid id)
		{
			// Null check for table
			if (_context.Category == null)
			{
				return NotFound();
			}

			// Attempt to grab category with ID
			var cat = _context.Category.Find(id);

			// Null check for entity
			if (cat == null)
			{
				return NotFound();
			}

			return await _context.Category.Where(c => c.Id == id).FirstOrDefaultAsync();
		}

		/// <summary>
		/// Gets a custom object combining a book object and an array of categories that are associated with it
		/// </summary>
		/// <returns>Custom object with a book and its associated categories</returns>
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Category>>> GetBookCategoriesAsync()
		{
			// Null check for tables
			if (_context.Category == null || _context.Book == null || _context.CategoryBookJunction == null)
			{
				return NotFound();
			}

			List<Book> books = await _context.Book.ToListAsync();
	
			List<JointCategoryWithBooks> finals = new();

			foreach(Book book in books )
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

			return Ok(finals);
		}

		/// <summary>
		/// Gets an array of books that are within a category matching the provided ID
		/// </summary>
		/// <param name="id">Category entity ID</param>
		/// <returns>Array of books connected to category</returns>
		[HttpGet("/categoryBooks/{id}")]
		public async Task<ActionResult<IEnumerable<Book>>> GetBooksByCategoryAsync(Guid id)
		{
			// Null check for tables
			if (_context.Category == null || _context.Book == null || _context.CategoryBookJunction == null)
			{
				return NotFound();
			}

			// Attempt to grab category with ID
			var cat = _context.Category.Find(id);

			// Null check for entity
			if (cat == null)
			{
				return NotFound();
			}

			// Grab an enumerable list of books that belong to the category
			IEnumerable<Book> bookEnum = from b in _context.Book
						   join cbj in _context.CategoryBookJunction on b.Id equals cbj.BookId
						   join c in _context.Category on cbj.CategoryId equals cat.Id
						   select b;

			// Filter to distinct values and cast as array
			Book[] books = bookEnum.Distinct().ToArray();

			return Ok(books);
		}

		/// <summary>
		/// Creates a new category
		/// </summary>
		/// <param name="model">Category model object coming from the front-end JSON</param>
		/// <returns>Created at action response (201)</returns>
		[HttpPost]
		public async Task<ActionResult<Category>> CreateCategory([FromBody] Category model)
		{
			// Null check for table
			if (_context.Category == null)
			{
				return NotFound();
			}

			// Add category
			_context.Category.Add(model);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetCategory), new { id = model.Id }, model);
		}

		/// <summary>
		/// Updates a category by ID
		/// </summary>
		/// <param name="id">Category entity ID</param>
		/// <param name="model">Category model sent from the front-end JSON</param>
		/// <returns>OK (200)</returns>
		/// <exception cref="DbUpdateConcurrencyException"></exception>
		[HttpPut("{id}")]
		public async Task<ActionResult<Category>> UpdateCategory(Guid id, Category model)
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
		/// Deletes a category by ID
		/// </summary>
		/// <param name="id">Category entity ID</param>
		/// <returns>OK (200)</returns>
		[HttpDelete("{id}")]
		public async Task<ActionResult<Category>> DeleteCategory(Guid id)
		{
			// Null check for table
			if (_context.Category == null || _context.CategoryBookJunction == null)
			{
				return NotFound();
			}

			// Attempt to grab category with ID
			var cat = await _context.Category.FindAsync(id);

			// Null check for entity
			if (cat == null)
			{
				return NotFound();
			}

			// First, delete all junction items related to this category
			_context.CategoryBookJunction.RemoveRange(_context.CategoryBookJunction.Where(cbj => cbj.CategoryId.Equals(id)));
			// Remove item from table
			_context.Category.Remove(cat);
			await _context.SaveChangesAsync();

			return Ok();
		}

	}
}
