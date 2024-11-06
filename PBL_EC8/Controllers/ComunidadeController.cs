using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Pbl_EC8.Models;
using PBL_EC8.Bll;
using PBL_EC8;
using AspNetCoreGeneratedDocument;

namespace PBL_EC8.Controllers;

public class ComunidadeController : Controller
{
    private readonly ILogger<ComunidadeController> _logger;
    private readonly UsuarioBll usuarioBll;

    // Construtor injetando tanto o ILogger quanto o UsuarioBll
    public ComunidadeController(ILogger<ComunidadeController> logger, UsuarioBll _usuarioBll)
    {
        _logger = logger;
        usuarioBll = _usuarioBll;
    }

    public IActionResult ComunidadeIndex()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
