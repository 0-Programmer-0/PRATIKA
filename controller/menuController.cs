using Microsoft.AspNetCore.Mvc;

namespace script_pbl.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class menuController : ControllerBase
    {
        [HttpGet("{userId}")]
        public ActionResult<User> GetUser(int userId)
        {
            // Simular dados do usuário
            var user = new User
            {
                Id = userId,
                Name = "João Silva",
                Email = "joao.silva@example.com"
            };

            return Ok(user);
        }
    }

    
}
