import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  geojsonLayer!: L.GeoJSON;

  constructor(private http: HttpClient) {}

  ngOnInit() {
  const map = L.map('map').setView([47.7, 67.8], 4.5); // Установите начальные координаты и масштаб

  // Добавьте тайловый слой (например, OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Добавьте маркер
  // L.marker([47.7, 67.8]).addTo(map)
  //   .bindPopup('Hello, Leaflet!');
  this.http.get('assets/geoBoundaries-KZ.geojson').subscribe((data: any) => {
    this.geojsonLayer = L.geoJSON(data, {
      style: {
        fillColor: 'transparent',
        weight: 2,
        opacity: 1,
        color: 'blue',
        fillOpacity: 0.5
      }
    }).addTo(map);
  });


  }

}
