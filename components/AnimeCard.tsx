interface Genre {
	mal_id: number;
	name: string;
}

interface AnimeProps {
	anime: {
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
	};
}

const AnimeCard = ({
	anime,
	ref,
}: AnimeProps & { ref?: React.Ref<HTMLDivElement> }) => {
	return (
		<div ref={ref} className='bg-secondary py-4 px-[3px] text-black'>
			<div className='flex justify-center px-3'>
				<img
					src={anime.images.jpg.image_url}
					alt={anime.title}
					className='h-50 max-md:h-45 object-cover'
				/>
			</div>
			<div className='max-h-12 flex items-center justify-center bg-primary mt-4 p-2 overflow-hidden'>
				<h3 className='text-base font-semibold flex items-center justify-center text-center text-secondary line-clamp-2 w-full'>
					{anime.title}
				</h3>
			</div>

			<div className='mt-2 flex items-center justify-center'>
				<div className='flex flex-wrap gap-2 mt-2 justify-center items-center'>
					{anime.genres.map((genre) => (
						<span
							key={genre.mal_id}
							className='bg-accent px-3 py-1 rounded-full text-xs'
						>
							{genre.name}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default AnimeCard;
