'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import AnimeCard from '@/components/AnimeCard';
import SearchBox from '@/components/SearchBox';
import { useInView } from 'react-intersection-observer';
import Spinner from '@/components/Spinner';

interface Genre {
	mal_id: number;
	name: string;
}

interface Anime {
	mal_id: number;
	title: string;
	images: {
		jpg: {
			image_url: string;
		};
	};
	genres: Genre[];
	year: number;
	season: string;
}

const Home = () => {
	const [anime, setAnime] = useState<Anime[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [debauncedSearchTerm, setDebouncedSearchTerm] = useState('');
	const [pageNum, setPageNum] = useState(1);
	const [pageLimit, setPageLimit] = useState(10);
	const [ref, inView] = useInView();

	useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

	const fetchAnime = async (q: string = '', page: number = 1) => {
		setLoading(true);
		setError('');
		try {
			// const skip = page * 16;
			const res = await fetch(
				`https://api.jikan.moe/v4/anime?q=${q}&limit=16&page=${page}&order_by=score&sort=desc`
			);
			const data = await res.json();
			const filteredAnime = data.data.filter((anime: Anime) =>
				anime.genres.every(
					(genre) =>
						!['Hentai', 'Ecchi', 'Yaoi', 'Yuri', 'Erotica'].includes(genre.name)
				)
			);

			return { ...data, data: filteredAnime };
			// console.log(data);
			// const uniqueAnime = Array.from(
			// 	new Map(data.data.map((a) => [a.mal_id, a])).values()
			// );

			// setAnime(uniqueAnime);
		} catch (error) {
			console.error(`Error fetching anime: ${error}`);
			setError('Error fetching anime. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAnime(debauncedSearchTerm, pageNum).then((data) => {
			if (data) {
				setAnime(() => {
					const uniqueAnime = Array.from(
						new Map(
							(data.data as Anime[]).map((a: Anime) => [a.mal_id, a])
						).values()
					);

					return uniqueAnime;
				});
				setPageLimit(data.pagination.last_visible_page);
			} else {
				console.error('No data received from fetchAnime');
			}
		});
	}, [debauncedSearchTerm]);

	useEffect(() => {
		if (inView && pageNum <= pageLimit) {
			fetchAnime(debauncedSearchTerm, pageNum + 1).then((data) => {
				setAnime((prevAnime) => {
					const mergedAnime = [...prevAnime, ...data.data];

					const uniqueAnime = Array.from(
						new Map(mergedAnime.map((a) => [a.mal_id, a])).values()
					);

					return uniqueAnime;
				});

				setPageNum((prevPage) => prevPage + 1);
			});
		}
	}, [inView]);

	return (
		<div className='min-h-screen bg-primary text-secondary p-10'>
			{/* Hero Section */}
			<div className='flex items-center justify-center p-10 h-40 max-xl:h-36 max-md:h-34 w-full'>
				<div className='h-full flex items-center text-center'>
					<h1 className='text-secondary text-7xl max-xl:text-6xl max-md:text-5xl font-bold'>
						Discover the World of Anime
					</h1>
				</div>
			</div>

			{/* Search Box */}
			<SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

			{/* Loading & Error Handling */}
			{loading && <Spinner />}
			{error && <p className='text-red-500'>{error}</p>}

			{/* Anime List */}
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10'>
				{anime.map((a, index) =>
					index !== anime.length - 1 ? (
						<AnimeCard key={a.mal_id} anime={a} />
					) : (
						<AnimeCard key={a.mal_id} anime={a} ref={ref} />
					)
				)}
			</div>
		</div>
	);
};

export default Home;
