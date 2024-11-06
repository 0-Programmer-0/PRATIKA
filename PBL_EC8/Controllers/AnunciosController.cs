using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Pbl_EC8.Models;
using PBL_EC8.Bll;
using PBL_EC8;
using AspNetCoreGeneratedDocument;

namespace PBL_EC8.Controllers;

public class AnunciosController : Controller
{
    private readonly ILogger<AnunciosController> _logger;
    private readonly UsuarioBll usuarioBll;

    // Construtor injetando tanto o ILogger quanto o UsuarioBll
    public AnunciosController(ILogger<AnunciosController> logger, UsuarioBll _usuarioBll)
    {
        _logger = logger;
        usuarioBll = _usuarioBll;
    }

    public IActionResult AnunciosIndex()
    {
        return View();
    }

    [HttpPost]
    public async Task<JsonResult> ValidacaoLogin(string login, string senha)
    {
        RetornoAcaoDto resultado = await usuarioBll.ValidacaoLogin(login, senha);
        return Json(new { success = resultado.Sucesso, message = resultado.Mensagem, redirectUrl = Url.Action("ComunidadeIndex", "Comunidade") });
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
