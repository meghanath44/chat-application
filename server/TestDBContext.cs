using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server
{
    public class TestDBContext : DbContext
    {
        public TestDBContext(DbContextOptions<TestDBContext> options):base(options) { 

        }
        public DbSet<User> Users { get; set; }
    }
}
