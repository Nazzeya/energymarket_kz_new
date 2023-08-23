import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-lines',
  templateUrl: './map-lines.component.html',
  styleUrls: ['./map-lines.component.scss']
})
export class MapLinesComponent implements OnInit {
  geojsonLayer!: L.GeoJSON;

  constructor(private http: HttpClient) {}

  ngOnInit() {
  const map = L.map('map1').setView([47.7, 67.8], 4.5); // Установите начальные координаты и масштаб

  // Добавьте тайловый слой (например, OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Добавьте маркер
  // L.marker([47.7, 67.8]).addTo(map)
  //   .bindPopup('Hello, Leaflet!');

  this.http.get('assets/lines-existing_0.geojson').subscribe((data: any) => {
    this.geojsonLayer = L.geoJSON(data, {
      style: {
        fillColor: 'transparent',
        weight: 2,
        opacity: 1,
        color: 'red',
        fillOpacity: 0.5
      }
    }).addTo(map);
  });


  }

}
