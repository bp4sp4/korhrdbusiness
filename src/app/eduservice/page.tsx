"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Clock, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

const mockLocations: LocationData[] = [
  {
    id: 1,
    name: "스타벅스 강남점",
    address: "서울특별시 강남구 테헤란로 152",
    category: "카페",

    coordinates: { lat: 37.5665, lng: 126.978 },
    openHours: "06:00 - 22:00",
    distance: "0.2km",
    phone: "02-1234-5678",
  },
  {
    id: 2,
    name: "롯데월드타워",
    address: "서울특별시 송파구 올림픽로 300",
    category: "관광지",

    coordinates: { lat: 37.5125, lng: 127.1025 },
    openHours: "10:00 - 22:00",
    distance: "1.5km",
    phone: "02-2147-6000",
  },
  {
    id: 3,
    name: "경복궁",
    address: "서울특별시 종로구 사직로 161",
    category: "관광지",

    coordinates: { lat: 37.5796, lng: 126.977 },
    openHours: "09:00 - 18:00",
    distance: "2.1km",
    phone: "02-3700-3900",
  },
  {
    id: 4,
    name: "이디야커피 홍대점",
    address: "서울특별시 마포구 와우산로 94",
    category: "카페",

    coordinates: { lat: 37.5563, lng: 126.9236 },
    openHours: "07:00 - 23:00",
    distance: "0.8km",
    phone: "02-333-4567",
  },
  {
    id: 5,
    name: "남산타워",
    address: "서울특별시 용산구 남산공원길 105",
    category: "관광지",

    coordinates: { lat: 37.5512, lng: 126.9882 },
    openHours: "10:00 - 23:00",
    distance: "1.2km",
    phone: "02-3455-9277",
  },
];

const KakaoMapSearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );

  // 초기 로딩 시 모든 장소 표시
  useEffect(() => {
    setSearchResults(
      mockLocations.map((location) => ({
        id: location.id,
        name: location.name,
        address: location.address,
        category: location.category,

        distance: location.distance,
        openHours: location.openHours,
        phone: location.phone,
      }))
    );
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    // 실제 구현에서는 데이터베이스 API 호출
    setTimeout(() => {
      const filtered = mockLocations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(
        filtered.map((location) => ({
          id: location.id,
          name: location.name,
          address: location.address,
          category: location.category,

          distance: location.distance,
          openHours: location.openHours,
          phone: location.phone,
        }))
      );

      setIsLoading(false);
    }, 800);
  };

  const handleLocationSelect = (result: SearchResult) => {
    const fullLocation = mockLocations.find((loc) => loc.id === result.id);
    if (fullLocation) {
      setSelectedLocation(fullLocation);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      // 검색어가 비어있으면 모든 장소 표시
      setSearchResults(
        mockLocations.map((location) => ({
          id: location.id,
          name: location.name,
          address: location.address,
          category: location.category,
          distance: location.distance,
          openHours: location.openHours,
          phone: location.phone,
        }))
      );
    }
  }, [searchQuery]);

  return (
    <div className="flex h-screen bg-background">
      {/* 카카오맵 영역 */}
      <div className="flex-1 relative bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto">
              <MapPin className="w-12 h-12 text-yellow-800" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                카카오맵
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedLocation
                  ? `${selectedLocation.name} 위치`
                  : "검색 결과를 선택하면 지도에 표시됩니다"}
              </p>
            </div>
            {selectedLocation && (
              <div className="bg-background border border-border rounded-lg p-4 max-w-sm">
                <h4 className="font-medium text-foreground">
                  {selectedLocation.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedLocation.address}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedLocation.distance}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 검색 영역 */}
      <div className="w-96 bg-background border-l border-border flex flex-col">
        {/* 검색 헤더 */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            장소 검색
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="장소명, 주소, 카테고리 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <Button
              onClick={handleSearch}
              className="w-full"
              disabled={!searchQuery.trim() || isLoading}
            >
              {isLoading ? "검색 중..." : "검색"}
            </Button>
          </div>
        </div>

        {/* 검색 결과 영역 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                {searchResults.length}개의 검색 결과
              </p>
              {searchResults.map((result) => (
                <Card
                  key={result.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleLocationSelect(result)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-foreground">
                        {result.name}
                      </h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {result.category}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {result.address}
                    </p>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>{result.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{result.openHours}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        <span>{result.phone}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : searchQuery && !isLoading ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-sm text-muted-foreground">
                다른 키워드로 검색해보세요
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default KakaoMapSearchComponent;
