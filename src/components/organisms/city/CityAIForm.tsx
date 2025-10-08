"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCities } from "@/hooks/use-cities";
import { Form } from "@/components/ui/form";
import { Options } from "@/types/type";
import { FormSelect } from "@/components/atoms/FormSelect";
import FormSection from "@/components/molecules/FormSection";
import { useState } from "react";
import { CityAIResponseType } from "@/app/api/auth/ai-generate/cities/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DestinationAIDataTYpe,
  destinationAISchema,
} from "@/schemas/destinationName";

interface CityFormProps {
  destinations: Options;
}

export function CityAIForm({ destinations }: CityFormProps) {
  const [cityData, setCityData] = useState<CityAIResponseType[]>([]);
  const { loading, createAICity, saveCityAIData } = useCities({
    autoFetch: false,
  });
  const form = useForm<DestinationAIDataTYpe>({
    resolver: zodResolver(destinationAISchema),
  });

  const { control, handleSubmit, watch } = form;
  const destinationName = watch("destinationName");

  const onSubmit = async (data: DestinationAIDataTYpe) => {
    try {
      const submitData = {
        destinationName: data.destinationName,
      };
      const resData = await createAICity(submitData);
      setCityData(resData?.data ?? []);
    } catch (err: any) {
      console.error("Error submitting city", err);
      toast.error(err.message || "Error submitting city");
    }
  };

  const handleSaveCity = async () => {
    await saveCityAIData(cityData);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormSection title="Generate City Data Form" icon="📍">
            <FormSelect
              label="Destination"
              name="destinationName"
              control={control}
              options={destinations}
              placeholder="Select Destination"
            />
            <div className="flex gap-2">
              <div className="flex items-end">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  Generate City Data
                </Button>
              </div>
              {cityData && cityData?.length > 0 && (
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSaveCity}
                  >
                    {loading && <Loader2 className="animate-spin mr-2" />}
                    Save City Data
                  </Button>
                </div>
              )}
            </div>
          </FormSection>
        </form>
      </Form>

      {cityData && cityData?.length > 0 && (
        <FormSection title={`${destinationName}: generated data`}>
          {cityData?.map((city: CityAIResponseType) => {
            return (
              <Card
                key={city.name}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300 py-0"
              >
                <div className="h-20 w-full relative overflow-hidden rounded-t-lg">
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-lg font-bold">
                      {city.name}
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-sm text-muted-foreground mb-3">
                    {city.description}
                  </CardDescription>

                  {city.mustSeeAttractions &&
                    city.mustSeeAttractions.length > 0 && (
                      <div className="mb-2 flex gap-2">
                        <h4 className="text-sm font-semibold mb-1">
                          Must-See Attractions:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {city.mustSeeAttractions.map((attraction) => (
                            <Badge key={attraction} variant="secondary">
                              {attraction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {city.activities && city.activities.length > 0 && (
                    <div className="flex gap-2">
                      <h4 className="text-sm font-semibold mb-1">
                        Activities:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {city.activities.map((activity) => (
                          <Badge key={activity} variant="outline">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </FormSection>
      )}
    </>
  );
}
