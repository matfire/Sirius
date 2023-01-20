<script>
	import { PUBLIC_MAPBOX_TOKEN, PUBLIC_NASA_KEY } from '$env/static/public';
	import { queryStore, subscriptionStore, getContextClient, setContextClient } from '@urql/svelte';
	import mapboxgl from 'mapbox-gl';
	import { onMount } from 'svelte';
	import { lastRecord, recordCreated } from '../utils/queries';
	import client from '../utils/urql';
	import {position} from "../stores/issPosition"
	import { dev } from '$app/environment';

	setContextClient(client);
	let mapElement;
	let map;
	let marker;

	const lastPosition = queryStore({
		client: getContextClient(),
		query: lastRecord
	});

	const currentPosition = subscriptionStore({
		client: getContextClient(),
		query: recordCreated
	});

	function updateMarkerPosition() {
		console.log($currentPosition?.data?.recordCreated);
		if ($currentPosition.data !== undefined) {
			const { latitude, longitude } = $currentPosition.data.recordCreated;
			position.set({latitude, longitude})
			if (dev && !marker) {
				marker = new mapboxgl.Marker({ color: 'red' })
				.setLngLat([
					$position.longitude,
					$position.latitude
				])
				.addTo(map);
				map.flyTo({
				zoom: 7,
				center: [
					$position.longitude,
					$position.latitude
				]
			});
			} else {
				marker.setLngLat([$position.longitude, $position.latitude]);
			}
		}
	}
	async function getImageFromCoords() {
		// const minLat = $position.latitude - (0.009) * 10
		// const maxLat = $position.latitude + (0.009) * 10
		// const minLon = $position.longitude - (0.009) * 10
		// const maxLon = $position.longitude + (0.009) * 10
		console.log(`https://api.nasa.gov/planetary/earth/imagery?api_key=${PUBLIC_NASA_KEY}&lat=${$position.latitude}&lon=${$position.longitude}`)
		try {
			const data = await (await fetch(`https://api.nasa.gov/planetary/earth/imagery?api_key=${PUBLIC_NASA_KEY}&lat=${$position.latitude}&lon=${$position.longitude}`)).json()
			console.log(data);

		} catch (error) {
			console.log(error)
		}
	}

	function initMapAndMarker() {
		if ($lastPosition.data && map) {
			const { latitude, longitude } = $lastPosition?.data?.lastRecord;
			position.set({latitude, longitude})
			
			map.flyTo({
				zoom: 7,
				center: [
					$position.longitude,
					$position.latitude
				]
			});
			marker = new mapboxgl.Marker({ color: 'red' })
				.setLngLat([
					$position.longitude,
					$position.latitude
				])
				.addTo(map);
		}
	}

	$: initMapAndMarker($lastPosition);
	$: updateMarkerPosition($currentPosition);

	onMount(() => {
		map = new mapboxgl.Map({
			accessToken: PUBLIC_MAPBOX_TOKEN,
			container: mapElement,
			style: 'mapbox://styles/mapbox/dark-v10'
		});
		map.addControl(new mapboxgl.NavigationControl());
		if ($position) {
			marker = new mapboxgl.Marker({ color: 'red' })
				.setLngLat([
					$position.longitude,
					$position.latitude
				])
				.addTo(map);
		}
	});

	function center() {
		map.flyTo({center: [$position.longitude, $position.latitude]})
		getImageFromCoords()
	}
</script>

<div class="w-full h-full relative">
	<button on:click={center} class="z-20 bg-red-500 absolute bottom-2 left-0 right-0 w-auto " >Center</button>
	<div id="map" class="z-0 absolute h-full w-full" bind:this={mapElement} />
</div>

