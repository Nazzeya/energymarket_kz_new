import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  // geojsonLayer!: L.GeoJSON;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const map = L.map('map').setView([47.7, 67.8], 4.5);  //середина карты и масштаб

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    this.http.get('assets/geoBoundaries-KZ.geojson').subscribe((data: any) => {  //границы областей и казахстана
      this.addboundaries(data, map);
    });

    this.http.get('assets/stations.geojson').subscribe((data: any) => {  //станции
      this.addStationsToMap(data, map);
    });

    // this.http.get('assets/substations.geojson').subscribe((data: any) => { //подстанции
    //   this.addSubstations(data, map);
    // })


  }

  addboundaries(data: any, map: L.Map){ // функция добавления границ
    L.geoJSON(data, {
      style: {
        fillColor: 'transparent',
        weight: 1,
        opacity: 1,
        color: 'blue',
        fillOpacity: 0.5
      }
    }).addTo(map);
  }

  addSubstations(data: any, map: L.Map){
    const substationIcon = L.icon({
      iconUrl: 'assets/icons/substation.png',
      iconSize: [20, 20],
      iconAnchor: [10, 20]
    });

    L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      // Создание маркера для каждой подстанции
      return L.marker(latlng, { icon: substationIcon });
    },
    onEachFeature: function (feature, layer) {
      // Добавление всплывающей подсказки (popup) с информацией о подстанции
      const properties = feature.properties;
      const popupContent = `
        <h3>${properties['название подстанции']}</h3>
        <p><strong>Траспределительная компания:</strong> ${properties['распределительная компания']}</p>
        <p><strong>Максимальное рабочее напряжение:</strong> ${properties['максимальное рабочее напряжение']}</p>
        <p><strong>рабочее напряжение:</strong> ${properties['рабочее напряжение']}</p>
      `;
      layer.bindPopup(popupContent);
    }
  }).addTo(map);
  }

  addStationsToMap(data: any, map: L.Map) {  //функция добавления станций

  const renewableIcon = L.icon({
  iconUrl: 'assets/icons/renewable.png',
  iconSize: [32, 32],
  iconAnchor: [10, 20],
});

const defaultIcon = L.icon({
  iconUrl: 'assets/icons/generator.png',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

  L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      const stationType = feature.properties['тип станции'];
      let stationIcon;
    // Выбор иконки в зависимости от типа станции
      if (stationType === '(СЭС) Солнечная электростанция' || stationType === '(ГЭС) Гидроэлектростанция' || stationType === '(ВЭС) Ветряная электростанция') {
        stationIcon = renewableIcon;
      }  else {
      // Установите стандартную иконку, если тип станции неизвестен
        stationIcon = defaultIcon;
      }
      // Создание маркера для каждой станции
      return L.marker(latlng, { icon: stationIcon });
    },
    onEachFeature: function (feature, layer) {
      // Добавление всплывающей подсказки (popup) с информацией о станции
      const properties = feature.properties;
      const popupContent = `
        <h3>${properties['название станции']}</h3>
        <p><strong>Тип станции:</strong> ${properties['тип станции']}</p>
        <p><strong>Генерирующая компания:</strong> ${properties['генерирующая компания']}</p>
        <p><strong>Электрическая мощность:</strong> ${properties['электрическая мощность']}</p>
        <p><strong>Тепловая мощность:</strong> ${properties['тепловая мощность']}</p>
        <p><strong>Состояние:</strong> ${properties['состояние']}</p>
        <p><strong>Основное топливо:</strong> ${properties['основное топливо']}</p>
        <p><strong>Годовая выработка электричества:</strong> ${properties['годовая выработка электричества']}</p>
      `;
      layer.bindPopup(popupContent);
    }
  }).addTo(map);
  }

  

}
