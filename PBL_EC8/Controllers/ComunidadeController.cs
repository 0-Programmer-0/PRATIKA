using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Pbl_EC8.Models;
using PBL_EC8.Bll;
using PBL_EC8;

namespace PBL_EC8.Controllers;

public class ComunidadeController: Controller
{
    private readonly ILogger<ComunidadeController> _logger;

    // Construtor injetando tanto o ILogger quanto o UsuarioBll
    public ComunidadeController(ILogger<ComunidadeController> logger)
    {
        _logger = logger;
       
    }

   public IActionResult ComunidadeIndex()
    {
        return View();
    }

    [HttpPost]
    public IActionResult ShowModalContent()
    {
        return PartialView("_NovaPostagem"); // Retorna a partial view
    }


    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
}
