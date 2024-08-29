using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PBLApi.Models;

namespace PBLApi.Data
{
    public class PBLContext : DbContext
    {
        public PBLContext (DbContextOptions<PBLContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Book { get; set; } = default!;
        public DbSet<Category> Category { get; set; } = default!;
        public DbSet<CategoryBookJunction> CategoryBookJunction { get; set; } = default!;
	}
}
