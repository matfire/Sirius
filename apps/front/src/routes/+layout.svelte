<script>
	  import "../app.css";
</script>

<header class="w-full h-12 flex items-center justify-between px-4">
	<div>
		<a href="/">Sirius</a>
	</div>
	<nav>
		<ul>
			<li>
				<a href="/locations">Locations</a>
			</li>
		</ul>
	</nav>
</header>
<main>
	<slot />
</main>
<footer>
	<p>&copy; {new Date().getFullYear()} - Code Tavern</p>
</footer>