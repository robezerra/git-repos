import { useState } from 'react';
import { FaGithub, FaPlus } from 'react-icons/fa';
import api from '../../services/api';

import { Container, Form, SubmitButton } from './styles';

export default function Main() {
	const [newRepo, setNewRepo] = useState('');

	function handleInputChange(e) {
		setNewRepo(e.target.value);
	}

	function handleSubmit(e) {
		e.preventDefault();

		const response = api.get(`repos/${newRepo}`);
	}

	return (
		<Container>
			<h1>
				<FaGithub size={25} />
				Meus Repositórios
			</h1>

			<Form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Adicionar Repositórios"
					valu={newRepo}
					onChange={handleInputChange}
				/>

				<SubmitButton>
					<FaPlus color="#FFF" size={14} />
				</SubmitButton>
			</Form>
		</Container>
	);
}
