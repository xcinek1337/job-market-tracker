import { useEffect, useState } from 'react';
import { Chart } from 'react-charts';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const VITE_SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY!;

type ChartData = {
	date: Date;
	count_offers: number;
};

function App() {

	const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);
	const [data, setData] = useState<ChartData[]>([]);

	// Fetch danych z Supabase
	useEffect(() => {
		const fetchOffers = async () => {
			const { data: offers, error } = await supabase
				.from('offers') // nazwa tabeli
				.select('*'); // wybierz wszystkie dane

			if (error) {
				console.error('Błąd:', error);
			} else {
				// Zakładając, że w tabeli są kolumny "created_at" i "count_offers"
				const chartData: ChartData[] = offers.map((offer) => ({
					date: new Date(offer.created_at),
					count_offers: offer.count_offers,
				}));
				setData(chartData); // Zapisujemy dane do stanu
			}
		};

		fetchOffers();
	}, []);

	// Definicje dla wykresu
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const primaryAxis: any = {
		getValue: (datum: ChartData) => datum.date,
		// Ustawienie typu skali dla osi czasu
		scaleType: 'time', // 'time' dla osi, które reprezentują daty
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const secondaryAxes: any = [
		{
			getValue: (datum: ChartData) => datum.count_offers,
			// Ustawienie typu skali dla osi Y
			scaleType: 'linear', // 'linear' dla osi liczbowych
		},
	];

	// Przygotowanie danych do wykresu
	const chartData = [
		{
			label: 'Liczba ofert',
			data: data.map((item) => ({
				date: item.date,
				count_offers: item.count_offers,
			})),
		},
	];

	return (
		<div className='App'>
			<h1>Wykres liczby ofert</h1>
			<Chart
				options={{
					data: chartData,
					primaryAxis,
					secondaryAxes,
				}}
			/>
		</div>
	);
}

export default App;
