using System.ComponentModel.DataAnnotations.Schema;

namespace PBLApi.Models
{
	/// <summary>
	/// Custom entity that holds a book entity as well as its associated categories within an array
	/// This is mainly used for searching and rendering books correctly within multiple categories
	/// </summary>
	public class JointCategoryWithBooks
	{
		/// <summary>
		/// Book object to be joined with category data
		/// </summary>
		public required Book JointBook { get; set; }
		/// <summary>
		/// Array of categories associated with book
		/// </summary>
		public required Category[] Categories { get; set; }
    }
}
