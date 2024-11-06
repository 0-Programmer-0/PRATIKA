using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Pbl_EC8.Models;
using PBL_EC8.Bll;
using PBL_EC8;
using AspNetCoreGeneratedDocument;

namespace PBL_EC8.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly UsuarioBll usuarioBll;

    // Construtor injetando tanto o ILogger quanto o UsuarioBll
    public HomeController(ILogger<HomeController> logger, UsuarioBll _usuarioBll)
    {
        _logger = logger;
        usuarioBll = _usuarioBll;
    }

    public IActionResult Menu()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult CadastroUsuario()
    {
        return View();
    }

    [HttpPost]
    public async Task<JsonResult> ValidacaoLogin(string login, string senha)
    {
        RetornoAcaoDto resultado = await usuarioBll.ValidacaoLogin(login, senha);
        if(resultado.Sucesso)
            HttpContext.Session.SetString("Usuario", login);
        return Json(new { success = resultado.Sucesso, message = resultado.Mensagem, redirectUrl = Url.Action("ComunidadeIndex", "Comunidade") });
    }

    [HttpPost]
    public async Task<JsonResult> CadastrarUsuario(UsuarioDto dto)
    {
        RetornoAcaoDto resultado = await usuarioBll.CriarUsuario(dto);
        return Json(new { success = resultado.Sucesso, message = resultado.Mensagem, redirectUrl = Url.Action("ComunidadeIndex", "Comunidade") });
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
