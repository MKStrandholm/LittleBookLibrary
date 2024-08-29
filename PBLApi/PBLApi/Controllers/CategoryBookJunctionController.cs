using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PBLApi.Data;
using PBLApi.Models;

namespace PBLApi.Controllers
{
	[Route("[controller]")]
	[ApiController]
	public class CategoryBookJunctionController : ControllerBase
	{
		private readonly PBLContext _context;

		public CategoryBookJunctionController(PBLContext context)
		{
			_context = context;
		}

		/// <summary>
		/// Gets all category-book junction records
		/// </summary>
		/// <returns>List of category-book junctions</returns>
		[HttpGet("/categoryBookJunctions")]
		public async Task<ActionResult<IEnumerable<CategoryBookJunction>>> GetCategoryBookJunctionsAsync()
		{
			// Null check for table
			if (_context.CategoryBookJunction == null)
			{
				return NotFound();
			}

			return await _context.CategoryBookJunction.ToListAsync();
		}

		/// <summary>
		/// Gets a category-book junction record by ID
		/// </summary>
		/// <param name="id">Category-book junction entity ID</param>
		/// <returns>Category-book junction object matching the provided ID</returns>
		[HttpGet("/categoryBookJunctions/details/{id}")]
		public async Task<ActionResult<CategoryBookJunction>> GetCategoryBookJunction(Guid id)
		{
			// Null check for table
			if (_context.CategoryBookJunction == null)
			{
				return NotFound();
			}

			// Attempt to grab category book junction with ID
			var cbj = _context.CategoryBookJunction.Find(id);

			// Null check for entity
			if (cbj == null)
			{
				return NotFound();
			}

			return await _context.CategoryBookJunction.Where(c => c.Id == id).FirstOrDefaultAsync();
		}

		/// <summary>
		/// Creates a new category-book junction record
		/// </summary>
		/// <param name="model">Category-book junction model sent from front-end JSON</param>
		/// <returns>Created at action response (201)</returns>
		[HttpPost]
		public async Task<ActionResult<CategoryBookJunction>> CreateCategoryBookJunction([FromBody] CategoryBookJunction model)
		{
			// Null check for table
			if (_context.CategoryBookJunction == null)
			{
				return NotFound();
			}
		
			// Add category book junction
			_context.CategoryBookJunction.Add(model);
			await _context.SaveChangesAsync();

			return CreatedAtAction(nameof(GetCategoryBookJunction), new { id = model.Id }, model);
		}

		/// <summary>
		/// Deletes a category-book junction
		/// </summary>
		/// <param name="categoryId">Category entity ID belonging to a junction</param>
		/// <param name="bookId">Book entity ID belonging to a junction</param>
		/// <returns>OK (200)</returns>
		[HttpDelete("{categoryId}/{bookId}")]
		public async Task<ActionResult<CategoryBookJunction>> DeleteCategoryBookJunction(Guid categoryId, Guid bookId)
		{
			// Null check for table
			if (_context.CategoryBookJunction == null)
			{
				return NotFound();
			}

			// Get record where IDs match
			var record = await _context.CategoryBookJunction.Where(cbj => cbj.CategoryId.Equals(categoryId) &&
																	cbj.BookId.Equals(bookId)).FirstOrDefaultAsync();

			// Null check for entity
			if (record == null)
			{
				return NotFound();
			}

			// Remove item from table
			_context.CategoryBookJunction.Remove(record);
			await _context.SaveChangesAsync();

			return Ok();
		}
	}
}
