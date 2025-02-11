interface SearchBoxProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
}

const SearchBox = ({ searchTerm, setSearchTerm }: SearchBoxProps) => {
	return (
		<div className='max-w-lg mx-auto mb-6'>
			<input
				type='text'
				placeholder='Search for an anime...'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className='w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-secondary'
			/>
		</div>
	);
};

export default SearchBox;
