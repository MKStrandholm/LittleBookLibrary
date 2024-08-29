namespace PBLApi.Models
{
	/// <summary>
	/// A category can have multiple books within it - just a simple descriptor
	/// </summary>
	public class Category
	{
		/// <summary>
		/// Unique identifier for category
		/// </summary>
		public Guid Id { get; set; }
		/// <summary>
		/// Name of category
		/// </summary>
		public required string Name { get; set; }
	}
}
