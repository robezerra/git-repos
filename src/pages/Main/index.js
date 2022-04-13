import { useState, useCallback, useEffect } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Container, Form, SubmitButton, List, DeleteButton } from './styles';

export default function Main() {
	const [newRepo, setNewRepo] = useState('');
	const [repositories, setRepositories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState(false);

	useEffect(() => {
		const repoStorage = localStorage.getItem('repos');

		if (repoStorage) {
			setRepositories(JSON.parse(repoStorage));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('repos', JSON.stringify(repositories));
	}, [repositories]);

	const handleSubmit = useCallback(
		(e) => {
			e.preventDefault();

			async function submit() {
				setLoading(true);

				try {
					if (newRepo === '') {
						throw new Error('Você precisa preencher o campo de pesquisa!');
					}

					const response = await api.get(`repos/${newRepo}`);

					const hasRepo = repositories.find((repo) => repo.name === newRepo);

					if (hasRepo) {
						throw new Error('Repositório já existe');
					}

					const data = {
						name: response.data.full_name,
					};
					setRepositories([...repositories, data]);
					setNewRepo('');
				} catch (error) {
					setAlert(true);
					console.log(error);
				} finally {
					setLoading(false);
				}
			}

			submit();
		},
		[newRepo, repositories]
	);

	function handleInputChange(e) {
		setNewRepo(e.target.value);
		setAlert(false);
	}

	const handleDelete = useCallback(
		(repo) => {
			const find = repositories.filter((r) => r.name !== repo);
			setRepositories(find);
		},
		[repositories]
	);

	return (
		<Container>
			<h1>
				<FaGithub size={25} />
				Meus Repositórios
			</h1>

			<Form onSubmit={handleSubmit} error={alert}>
				<input
					type="text"
					placeholder="Adicionar Repositórios"
					value={newRepo}
					onChange={handleInputChange}
				/>

				<SubmitButton loading={loading ? 1 : 0}>
					{loading ? (
						<FaSpinner color="#FFF" size={14} />
					) : (
						<FaPlus color="#FFF" size={14} />
					)}
				</SubmitButton>
			</Form>

			<List>
				{repositories.map((repo) => (
					<li key={repo.name}>
						<span>
							<DeleteButton onClick={() => handleDelete(repo.name)}>
								<FaTrash size={14} />
							</DeleteButton>
							{repo.name}
						</span>
						<Link to={`repository/${encodeURIComponent(repo.name)}`}>
							<FaBars size={20} />
						</Link>
					</li>
				))}
			</List>
		</Container>
	);
}
