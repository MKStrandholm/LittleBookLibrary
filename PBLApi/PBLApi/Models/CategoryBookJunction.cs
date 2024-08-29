namespace PBLApi.Models
{
	/// <summary>
	/// Junction entity to create a 1-many relationship between books and categories, which would
	/// normally be many-many
	/// </summary>
	public class CategoryBookJunction
	{
		/// <summary>
		/// Unique identifier for junction record
		/// </summary>
		public Guid Id { get; set; }
		/// <summary>
		/// Unique identifier for category
		/// </summary>
		public Guid CategoryId { get; set; }
		/// <summary>
		/// Unique identifier for book
		/// </summary>
		public Guid BookId { get; set; }
    }
}
