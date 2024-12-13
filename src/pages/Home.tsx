import { useEffect, useState } from "react";
import Navbar, { NavbarProps } from "../components/Navbar";
import Card from "../components/Card";
import {
  addSticky,
  fetchStickies,
  Sticky,
} from "../lib/queries/stickies_repo";
import { createTeam, fetchTeams, Team } from "../lib/queries/teams_repo";

function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateTeamModal, setCreateTeamModal] = useState(false);
  const [stickies, setStickies] = useState<Sticky[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedCreateStickyTeam, setSelectedCreateStickyTeam] = useState({} as Team);

  const navbarProps: NavbarProps = {
    fromLogin: true,
    fromRegister: true,
    fromHome: false,
  };

  //TODO: this is noob way of handling as form wont change, but not strong in react
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // on the selector change requery the stickies
  useEffect(() => {
    const fetchTeamsData = async () => {
      const data = await fetchTeams();
      setTeams(data);
    };

    const fetchStickiesData = async () => {
      const data = await fetchStickies();
      setStickies(data);
    };

    fetchTeamsData();
    fetchStickiesData();
    setSelectedCreateStickyTeam(teams[0]);
  }, []);

  return (
    <div>
      <Navbar {...navbarProps} />
      <div className="flex start m-4">
        <select className="select select-bordered w-full max-w-xs">
          <option disabled selected>
            Todos
          </option>
          {teams.map((team, index) => (
            <option key={index} onSelect={async (e: any) => {
              setSelectedTeam(e.target.value);
              await fetchStickies().then((data) => setStickies(data));
            }}>
              {team.name}
            </option>
          ))}
        </select>
        <div
          className="flex px-4 py-3 rounded-md border-2 border-blue-500 
          overflow-hidden ml-2 w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 192.904 192.904"
            width="16px"
            className="fill-gray-600 mr-3 rotate-90"
          >
            <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
          </svg>
          <input
            placeholder="Buscar algo..."
            className="w-full outline-none bg-transparent 
            text-white text-sm"
          />
        </div>
        <button
          className="btn btn-primary btn-rounded ml-2"
          onClick={() => setCreateTeamModal(true)}
        >
          Agregar equipo
        </button>
        {showCreateTeamModal ? (
          <dialog open id="my_modal_1" className="modal">
            <div className="modal-box w-full h-fit">
              <div className="flex flex-row-reverse">
                <button
                  className="flex-end btn btn-secondary btn-circle m-2"
                  onClick={() => setCreateTeamModal(false)}
                >
                  X
                </button>
              </div>
              <div>
                <form>
                  <input
                    name="name"
                    type="text"
                    placeholder="Nombre"
                    className="input input-bordered w-full m-2"
                    onChange={(e: any) => {
                      setTeamName(e.target.value);
                    }}
                  />
                  <button
                    className="btn btn-primary btn-rounded m-2"
                    type="submit"
                    onClick={async (e: any) => {
                      e.preventDefault();
                      await createTeam(teamName);
                      await fetchTeams().then((data) => setTeams(data));
                      setCreateTeamModal(false);
                    }}
                  >
                    Guardar
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        ) : (
          <></>
        )}
        <button
          className="btn btn-primary btn-rounded ml-2"
          onClick={() => {
            setShowCreateModal(true);
          }}
        >
          Agregar nota
        </button>
        {showCreateModal ? (
          <dialog open id="my_modal_1" className="modal">
            <div className="modal-box w-full h-fit">
              <div className="flex flex-row-reverse">
                <button
                  className="flex-end btn btn-secondary btn-circle m-2"
                  onClick={() => setShowCreateModal(false)}
                >
                  X
                </button>
              </div>
              <div>
                <form>
                  <select
                    className="select select-bordered w-full max-w-xs m-2"
                    onChange={async (e: any) => {
                      console.log(teams[e.target.selectedIndex]);
                      setSelectedCreateStickyTeam(teams[e.target.selectedIndex] as Team);
                    }}
                  >
                    {teams.map((team: Team, index: number) => (
                      <option key={index}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="title"
                    type="text"
                    placeholder="Título"
                    className="input input-bordered w-full m-2"
                    onChange={handleInputChange}
                  />
                  <input
                    name="content"
                    type="text"
                    placeholder="Contenido"
                    className="input input-bordered w-full m-2"
                    onChange={handleInputChange}
                  />
                  <button
                    className="btn btn-primary btn-rounded m-2"
                    type="submit"
                    onClick={async (e: any) => {
                      e.preventDefault();
                      console.log("selected team: " + JSON.stringify(selectedCreateStickyTeam));
                      await addSticky(formData.title, formData.content, selectedCreateStickyTeam);
                      const data = await fetchStickies();
                      setStickies(data);
                      setShowCreateModal(false);
                    }}
                  >
                    Guardar
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        ) : (
          <></>
        )}
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        {stickies.length === 0 ? (
          <></>
        ) : (
          stickies.map((sticky, index) => (
            <Card
              key={index}
              index={index}
              title={sticky.title}
              body={sticky.content}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
