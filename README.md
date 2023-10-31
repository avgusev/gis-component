# SKDF Gis Component

##

Обновление контейнера бэка на 3000 порту:

```
docker run -d -p 3000:3000 -e PGRST_DB_ANON_ROLE=developer -e PGRST_DB_SCHEMAS='nsi,gis_api,entity,gis_api_public,gis_api_private,hwm,gis,diag,command_api,query_api' -e PGRST_LOG_LEVEL='info' -e PGRST_DB_URI=postgres://developer:<password>@10.0.41.61:5432/SKDF  --name skdf-postgrest postgrest/postgrest
```

Обновление контейнера бэка на 3001 порту:

```
docker run -d -p 3001:3000 -e PGRST_DB_ANON_ROLE=developer -e PGRST_DB_SCHEMAS='gis_api_public,base_gis' -e PGRST_LOG_LEVEL='info' -e PGRST_DB_URI=postgres://developer:<password>@172.19.22.104:5432/skdf  --name skdf-postgrest-2 postgrest/postgrest
```

## Требования к проекту

- node = 16.14.2
- yarn = 1.22.19

## Описание структуры проекта

- Папка services - сервисы API Geoserver / API Backend;
- Папка layers - содержатся вся логика и вспомогательные компоненты для работы со слоями;
- Папка interactions - логика и компоненты работы с контейнером карты (типа Zoom, Rotate, DoubleClick, KeyboardPress etc.);
- Папка hooks - касмотные хуки;
- Папка features - содержатся вся логика и вспомогательные компоненты для работы со фичами;
- Папка controls - содержатся вся логика и вспомогательные компоненты используются компонентой GeoMap (аналог <App/> в ванильном react-приложении;
- Папка components - содержатся тупые компоненты, которые будут часто переиспользоваться ВНУТРИ пакета и не будут экспортироваться при билде;

## Линк и неприрывный билд пакета

В корне проекта команду выполняем `yarn link`, а после выполняем `yarn watch`.

## Использование пакета

Перед запуском pet-проекта в корне проекта выполняем команду `yarn link skdf-gis-component`, и далее `yarn start`

## Конвенция о ветках

- master - только для избранных (вызывает yarn publish - то есть публикует пакет);
- development - рабочая ветка куда попадают все features/bugs мерджем;
- feature-\* - ветка с фичами;
- hotfix-\* - ветка с фиксами багов;
- release-\* - запусает мердж в master (только с тэгом!);

##

# Компонента отображения карты MapContainer

## proxy

Для осуществления запросов из пакета к геосерверу, бекенду скдф.рф и бекенду postgrest необходимо настроить proxy на веб сервере основного проекта СКДФ для следующих точек:

1. Исходящие запросы с `http://<url проекта>/api-geoserver` перенаправить на `http://<geoserver url>:<geoserver port>/geoserver`.
2. Исходящие запросы с `http://<url проекта>/api-skdf` перенаправить на `https://xn--p1a.xn--d1aluo.xn--p1ai`.
3. Исходящие запросы с `http://<url проекта>/api-pg` перенаправить на `http://172.19.22.106:3000`.
4. Исходящие запросы с `http://<url проекта>/api-image` перенаправить на `http://10.0.41.92:6200/api`.
5. Исходящие запросы с `http://<url проекта>/api-pg-graph` перенаправить на `http://172.19.22.106:3001`.

## Пример использования компоненты

```tsx
import { MapContainer } from 'skdf-gis-component';
/*...*/
<Route path="/map/:id?" render={(rest) => <MapContainer routerRest={rest} />} userAuth={<Данные об авторизации пользователя>} />;
```

# Компонента отображения мини карты в паспорте дорог MapPassport

## interface

```
export interface MapPassportTypes {
  roadId: string | number;
  isEditGeom?: boolean;
}
```

У компоненты MapPassport есть один обязательный параметр `roadId`

## Пример использования компоненты

```tsx
import { MapPassport } from 'skdf-gis-component';
/*...*/
<MapPassport roadId={<id дороги>} isEditGeom={<boolean>} />;
```
