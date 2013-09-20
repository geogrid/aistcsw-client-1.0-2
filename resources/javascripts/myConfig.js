myConfig = {
    /**
     * Google Earthの代わりに読み込むデータベース
     */
    database: 'http://gee.geogrid.org/LSAT8/',

    CSW: {
        url: 'http://csw2.geogrid.org/CSW/opensat'
    },

    /**
     * Google Earthが初期化された際に表示する座標　
     */
    lookAt: {
        latitude: 37.0,
        longitude: 138.0,
        range: 3000000.0
    },

    /**
     * 検索されたシーンを表示する際の設定
     */
    scene: {
        icon: {
            service: 'WMS',
            request: 'GetMap',
            crs: 'epsg:4326',
            version: '1.3.0',
            transparent: 'true',
            format: 'image/png',
            image: {
                height: 512,
                width: 512
            },
            thumbnail: {
                height: 42,
                width: 42
            }
        },

        linerRing: {
            lineStyle: {
                color: 'e0ffffff',
                width: 2
            },
            polyStyle: {
                color: '100088ff'
            }
        }
    },

    /**
     * プロキシスクリプトのURL
     * index.htmlからの相対URLか、絶対URLで指定する
     */
    proxy: {
        url: 'scripts/proxy.php'
    },

    prepareDownloadScript: 'scripts/prepare_download.php',

    downloadScript: 'scripts/download.php',

    /**
     *  シーンに対応する画像を表示する際のURLのフォーマット
     */
    sceneImageUriTpl: [
        '{fileName}&amp;bbox={bBoxCoordinates}&amp;service={service}&amp;request={request}&amp;crs={crs}&amp;format={format}&amp;height={image.height}&amp;width={image.width}&amp;version={version}&amp;transparent={transparent}'
    ],

    /**
     * シーンの検索用クエリのテンプレート
     */
    queryTpl: [
        '<csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" service="CSW" version="2.0.2" resultType="results" outputSchema="ebrim" outputFormat="text/xml" startPosition="1" maxRecords="100">',
        '   <csw:DistributedSearch hopCount="0"></csw:DistributedSearch>',
        '   <csw:Query typeNames="csw:GetRecord">',
        '       <csw:Constraint version="1.0.0">',
        '           <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">',
        '               <ogc:And>',
        '                   <ogc:PropertyIsGreaterThanOrEqualTo>',
        '                       <ogc:PropertyName>beginPosition</ogc:PropertyName>',
        '                       <ogc:Literal>{beginPosition}</ogc:Literal>',
        '                   </ogc:PropertyIsGreaterThanOrEqualTo>',
        '                   <ogc:PropertyIsLessThanOrEqualTo>',
        '                       <ogc:PropertyName>endPosition</ogc:PropertyName>',
        '                       <ogc:Literal>{endPosition}</ogc:Literal>',
        '                   </ogc:PropertyIsLessThanOrEqualTo>',
        '                   <ogc:PropertyIsLessThanOrEqualTo>',
        '                       <ogc:PropertyName>cloudCoverPercentage</ogc:PropertyName>',
        '                       <ogc:Literal>{cloudCoverPercentage}</ogc:Literal>',
        '                   </ogc:PropertyIsLessThanOrEqualTo>',
        '                   <ogc:BBOX>',
        '                       <ogc:PropertyName>multiExtentOf</ogc:PropertyName>',
        '                       <gml:Envelope xmlns:gml="http://www.opengis.net/gml">',
        '                           <gml:lowerCorner>{lng1} {lat1}</gml:lowerCorner>',
        '                           <gml:upperCorner>{lng2} {lat2}</gml:upperCorner>',
        '                       </gml:Envelope>',
        '                   </ogc:BBOX>',
        '               </ogc:And>',
        '           </ogc:Filter>',
        '       </csw:Constraint>',
        '   </csw:Query>',
        '</csw:GetRecords>'
    ],

    /**
     * シーンの検索結果をGoogle Earth上に表示する際のLinerRingのテンプレート
     */
    linerRingTpl: [
        '<?xml version="1.0" encoding="UTF-8" ?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2">',
        '<Document>',
        '   <name>Results</name>',
        '   <Style id="transPoly">',
        '       <LineStyle>',
        '           <color>{lineStyle.color}</color>',
        '           <width>{lineStyle.width}</width>',
        '       </LineStyle>',
        '       <PolyStyle>',
        '           <color>{polyStyle.color}</color>',
        '       </PolyStyle>',
        '   </Style>',
        '   <Placemark id="{id}">',
        '       <visibility>1</visibility>',
        '       <styleUrl>#transPoly</styleUrl>',
        '       <MultiGeometry>',

        '           <Polygon>',
        '               <tessellate>1</tessellate>',
        '               <altitudeMode>clampToGround</altitudeMode>',
        '                   <outerBoundaryIs>',
        '                       <LinearRing>',
        '                           <coordinates>',

        '{[values.coordinates[0]]},{[values.coordinates[1]]},0\n',
        '{[values.coordinates[2]]},{[values.coordinates[3]]},0\n',
        '{[values.coordinates[4]]},{[values.coordinates[5]]},0\n',
        '{[values.coordinates[6]]},{[values.coordinates[7]]},0\n',
        '{[values.coordinates[8]]},{[values.coordinates[9]]},0\n',

        '                            </coordinates>',
        '                       </LinearRing>',
        '                   </outerBoundaryIs>',
        '           </Polygon>',

        '       </MultiGeometry>',
        '   </Placemark>',
        '</Document>',
        '</kml>'
    ],

    /**
     * シーンの検索結果をGoogle Earth上に表示する際のGroundOverlayのテンプレート
     */
    groundOverlayTpl: [
        '<?xml version="1.0" encoding="UTF-8" ?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2">',
        '   <Document>',
        '       <GroundOverlay id="{id}">',
        '           <name>Search result</name>',
        '           <visibility>0</visibility>',
        '           <description>{acquisitionDate}</description>',
        '           <Icon>',
        '               <href>{sceneImageUri}</href>',
        '           </Icon>',
        '           <LatLonBox>',
        '               <north>{north}</north>',
        '               <south>{south}</south>',
        '               <east>{east}</east>',
        '               <west>{west}</west>',
        '               <rotation>0</rotation>',
        '           </LatLonBox>',
        '       </GroundOverlay>',
        '   </Document>',
        '</kml>'
    ]
};
