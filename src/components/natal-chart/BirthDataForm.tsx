// src/components/natal-chart/BirthDataForm.tsx

import React, { useState } from 'react';

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
      invalidDate: string;
      invalidTime: string;
    };
  };
}

const BirthDataForm: React.FC<BirthDataFormProps> = ({ onSubmit, dictionary }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!date) newErrors.date = dictionary.validationErrors.required;
    if (!time) newErrors.time = dictionary.validationErrors.required;
    if (!city) newErrors.city = dictionary.validationErrors.required;
    if (!country) newErrors.country = dictionary.validationErrors.required;

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // No errors, submit form
    onSubmit({ date, time, city, country });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{dictionary.dateLabel}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
      </div>

      <div>
        <label>{dictionary.timeLabel}</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        {errors.time && <p style={{ color: 'red' }}>{errors.time}</p>}
      </div>

      <div>
        <label>{dictionary.cityLabel}</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
      </div>

      <div>
        <label>{dictionary.countryLabel}</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        {errors.country && <p style={{ color: 'red' }}>{errors.country}</p>}
      </div>

      <button type="submit">{dictionary.submitButton}</button>
    </form>
  );
};

export default BirthDataForm;
