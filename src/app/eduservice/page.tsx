"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";
import { supabase } from "@/lib/supabase";

interface LocationData {
  id: number;
  name: string;
  address: string;
  category: string;

  coordinates: {
    lat: number;
    lng: number;
  };
  openHours: string;
  distance: string;
  phone: string;
}

interface SearchResult {
  id: number;
  name: string;
  address: string;
  category: string;
  distance: string;
  openHours: string;
  phone: string;
}

interface Place {
  id: number;
  name: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
  open_hours: string;
  phone: string;
}

// TypeScript: declare kakao on window
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap: React.FC<{
  locations: any[];
  selectedLocation: any | null;
  mapRef: React.MutableRefObject<any>;
}> = ({ locations, selectedLocation, mapRef }) => {
  const mapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || locations.length === 0) return;
    window.kakao.maps.load(() => {
      const container = mapDivRef.current;
      const center = new window.kakao.maps.LatLng(
        locations[0].lat,
        locations[0].lng
      );
      const options = {
        center,
        level: 12,
      };
      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;

      locations.forEach((loc) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(loc.lat, loc.lng),
          map,
          title: loc.name,
        });
        // InfoWindow 항상 open
        const iw = new window.kakao.maps.InfoWindow({
          content: `<div style='padding:8px 12px;font-size:14px;'>${loc.name}</div>`,
        });
        iw.open(map, marker);
      });
    });
  }, [locations]);

  return <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />;
};

const PlaceList: React.FC<{
  places: any[];
  onSelect: (place: any) => void;
  loading: boolean;
}> = ({ places, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  if (!places) {
    return <div className="p-6">로딩 중...</div>;
  }
  if (places.length === 0) {
    return <div className="p-6">장소 데이터가 없습니다.</div>;
  }
  return (
    <div className="p-4 space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        {places.length}개의 장소
      </p>
      {places.map((place) => (
        <Card
          key={place.id}
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onSelect(place)}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-foreground">{place.name}</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {place.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {place.address}
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{place.open_hours}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{place.phone}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const KakaoMapSearchComponent: React.FC = () => {
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<any>(null);

  const fetchPlaces = async (keyword = "") => {
    setLoading(true);
    let query = supabase.from("places").select("*").order("id");
    if (keyword) {
      query = query.or(
        `name.ilike.%${keyword}%,address.ilike.%${keyword}%,category.ilike.%${keyword}%`
      );
    }
    const { data, error } = await query;
    if (!error && data) setPlaces(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = () => {
    fetchPlaces(search);
  };

  const handleReset = () => {
    setSearch("");
    fetchPlaces("");
  };

  const handleSelect = (place: any) => {
    setSelectedLocation(place);
    if (mapRef.current) {
      mapRef.current.setLevel(3);
      mapRef.current.panTo(new window.kakao.maps.LatLng(place.lat, place.lng));
    }
  };

  return (
    <>
      {/* 카카오맵 스크립트 동적 로드 */}
      <Script
        strategy="afterInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
      />
      <div className="flex h-screen w-screen flex-col md:flex-row">
        {/* 지도 영역 */}
        <div className="flex-1 min-w-0 h-[350px] md:h-full">
          <div className="w-full h-full">
            {places.length > 0 ? (
              <KakaoMap
                locations={places}
                selectedLocation={selectedLocation}
                mapRef={mapRef}
              />
            ) : (
              <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-yellow-800" />
              </div>
            )}
          </div>
        </div>
        {/* 검색 영역 */}
        <div className="w-full md:w-[400px] max-w-full md:max-w-[400px] h-full bg-white shadow-lg border-l border-border flex flex-col rounded-none md:rounded-l-2xl overflow-y-auto">
          <div className="p-6 border-b border-border flex gap-2">
            <Input
              placeholder="장소명, 주소, 카테고리 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="flex-1"
            />
            <Button onClick={handleSearch}>검색</Button>
            <Button variant="outline" onClick={handleReset}>
              리셋
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PlaceList
              places={places}
              onSelect={handleSelect}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default KakaoMapSearchComponent;
