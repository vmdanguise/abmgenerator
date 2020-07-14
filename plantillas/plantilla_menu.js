const fs = require('fs');
module.exports = function crearPlantillaAuxiliar(esquema_db,auxiliarLinks) {
  fs.writeFile(`./generated${esquema_db}/views/menu.hbs`,
`<script src="../public/js/menu.js"></script>
<header>
		<nav>
	<ul class="nav">
			<li><a href="/"><span class="icon-house"></span>Inicio</a></li>
			<li class="submenu">
				<a href="#"><span class="icon-rocket"></span>Proyectos<span class="caret icon-arrow-down6"></span></a>
				<ul class="children">
        ${auxiliarLinks}
        <li><a href="consultas?token={{token}}"><span class="icon-mail"></span>Consultas Personalizadas</a>
					</li>
					<li><a href="creartablas?token={{token}}"><span class="icon-earth"></span>Crear Esquema</a></li>
				</ul>
			</li>
			<li><a href="http://www.google.com">Salir e Ir a Google<span class="icon-dot"></span></a></li>
		</ul>
	</nav>
</header>
`
	, error => { if (error) console.log(error); });
	

	fs.writeFile(`./generated${esquema_db}/views/menuSuperAdmin.hbs`,
	`<script src="../public/js/menu.js"></script>
	<header>
	
		<nav>
		<ul class="nav">
				<li><a href="/"><span class="icon-house"></span>Inicio</a></li>
				<li class="submenu">
					<a href="#"><span class="icon-rocket"></span>Proyectos<span class="caret icon-arrow-down6"></span></a>
					<ul class="children">
			${auxiliarLinks}
			<li><a href="consultas?token={{token}}"><span class="icon-mail"></span>Consultas Personalizadas</a>
						</li>
						<li><a href="creartablas?token={{token}}"><span class="icon-earth"></span>Crear Esquema</a></li>
					</ul>
				</li>
				<li><a href="http://www.google.com">Salir e Ir a Google<span class="icon-dot"></span></a></li>
			</ul>
		</nav>
	</header>
	`
		, error => { if (error) console.log(error); });


		fs.writeFile(`./generated${esquema_db}/views/menuAdmin.hbs`,
		`<script src="../public/js/menu.js"></script>
		<header>
		
			<nav>
			<ul class="nav">
    			<li><a href="/"><span class="icon-house"></span>Inicio</a></li>
					<li class="submenu">
						<a href="#"><span class="icon-rocket"></span>Proyectos<span class="caret icon-arrow-down6"></span></a>
						<ul class="children">
				${auxiliarLinks}
				<li><a href="consultas?token={{token}}"><span class="icon-mail"></span>Consultas Personalizadas</a>
							</li>
							<li><a href="creartablas?token={{token}}"><span class="icon-earth"></span>Crear Esquema</a></li>
						</ul>
					</li>
					<li><a href="http://www.google.com">Salir e Ir a Google<span class="icon-dot"></span></a></li>
				</ul>
			</nav>
		</header>
		`
			, error => { if (error) console.log(error); });
	
};

