
'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es, enUS, de, fr } from 'date-fns/locale';

type LocaleCode = 'es' | 'en' | 'de' | 'fr';

interface BirthData {
  date: string;
  time: string;
  city: string;
  country: string;
}

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
  dictionary: {
    dateLabel: string;
    timeLabel: string;
    cityLabel: string;
    countryLabel: string;
    submitButton: string;
    validationErrors: {
      required: string;
    };
    pickDate: string;
  };
  locale?: LocaleCode;
}

const dateFnsLocalesMap = {
  es,
  en: enUS,
  de,
  fr,
};

const BirthDataForm: React.FC<BirthDataFormProps> = ({ onSubmit, dictionary, locale = 'en' }) => {
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(1990, 0, 1));
  const [birthTime, setBirthTime] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    if (!birthDate) newErrors.date = dictionary.validationErrors.required;
    if (!birthTime) newErrors.time = dictionary.validationErrors.required;
    if (!city) newErrors.city = dictionary.validationErrors.required;
    if (!country) newErrors.country = dictionary.validationErrors.required;
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      date: birthDate!.toISOString().split('T')[0],
      time: birthTime,
      city,
      country,
    });
  };

  const localeObj = dateFnsLocalesMap[locale] || enUS;

  return (
    <Card className="w-full max-w-xl mx-auto bg-card/70 backdrop-blur-sm border border-white/10 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl text-primary">🪐 {dictionary.submitButton}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="birth-date">{dictionary.dateLabel}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !birthDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, 'PPP', { locale: localeObj }) : dictionary.pickDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  locale={localeObj}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  captionLayout="dropdown-buttons"
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
          </div>

          <div>
            <Label htmlFor="birth-time">{dictionary.timeLabel}</Label>
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground" />
              <Input
                id="birth-time"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
              />
            </div>
            {errors.time && <p className="text-sm text-red-500 mt-1">{errors.time}</p>}
          </div>

          <div>
            <Label htmlFor="birth-city">{dictionary.cityLabel}</Label>
            <Input
              id="birth-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          <div>
            <Label htmlFor="birth-country">{dictionary.countryLabel}</Label>
            <div className="flex items-center gap-2">
              <Globe2 className="text-muted-foreground" />
              <Input
                id="birth-country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
          </div>

          <Button type="submit" className="w-full">{dictionary.submitButton}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BirthDataForm;
