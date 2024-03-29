import { gql, useQuery } from "@apollo/client";

/**
 * Modal component that displays character information.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.modalOpen - Flag indicating whether the modal is open or not.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setModalOpen - Function to set the modal open state.
 * @param {number} props.idCharacter - The ID of the character to fetch.
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setIdCharacter - Function to set the ID of the character to fetch.
 * @returns {JSX.Element} The rendered Modal component.
 */
export default function Modal({
  modalOpen,
  setModalOpen,
  idCharacter,
  setIdCharacter,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  idCharacter: number;
  setIdCharacter: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element {
  const GET_CHARACTER = gql`
    query GetCharacter($id: ID!) {
      character(id: $id) {
        name
        status
        species
        type
        gender
        origin {
          name
          dimension
        }
        location {
          name
          type
          dimension
        }
        image
        episode {
          name
          air_date
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: {
      id: idCharacter,
    },
  });

  return (
    <div
      className={`${
        !modalOpen && "hidden"
      } absolute top-0 right-0 z-50 flex flex-col w-screen h-[100dvh] backdrop-filter backdrop-blur-xl justify-center items-center pt-5
				`}
      onClick={() => {
        setModalOpen(false);
        setIdCharacter(0);
      }}
    >
      {modalOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-w-[90vw] max-h-[90vh] justify-center items-center overflow-hidden sm:min-w-[auto] sm:max-w-[auto] sm:min-h-[auto] sm:max-h-[auto]
						"
        >
          {(data || error) && (
            <button
              className={`btn btn-square absolute m-2 top-0 right-0 z-30 border-white border-2 text-white ${
                data
                  ? "bg-stone-900 hover:bg-stone-800 hover:border-stone-900 hover:text-white"
                  : "bg-red-900 hover:bg-red-800 hover:border-red-900 hover:text-red-900"
              }`}
              onClick={() => {
                setModalOpen(false);
                setIdCharacter(0);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 stroke-current shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {loading && (
            <span className="p-6 my-10 loading loading-spinner text-accent" />
          )}
          {error && !data && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 stroke-current shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {error.message || "We have a problem, please try again later."}
              </span>
            </div>
          )}
          {data && (
            <div className="relative flex flex-col items-center justify-center shadow-xl bg-stone-900 rounded-xl sm:flex-row">
              <figure className="relative rounded-xl w-[100%] h-[100%]">
                <img
                  className="relative object-cover w-[100%] h-[100%] rounded-xl sm:m-0"
                  src={data?.character.image}
                  alt={data?.character.name}
                />
              </figure>

              <div className="gap-1 px-5 py-2 ">
                <div className="flex flex-col flex-wrap gap-1">
                  <span className="overflow-hidden card-title text-pretty">
                    {data?.character.name}
                  </span>
                  {data?.character.status && (
                    <div
                      className={`badge ${
                        data?.character.status === "Dead"
                          ? "badge-error"
                          : data?.character.status === "Alive"
                            ? "badge-success"
                            : "badge-warning"
                      }`}
                    >
                      {data?.character.status}
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-wrap w-full gap-2 mt-3">
                  <div className="flex flex-row flex-wrap w-full gap-2 text-base">
                    <span>Last known location:</span>
                    <span>{data?.character.location.name}</span>
                  </div>
                  <div className="flex flex-row flex-wrap w-full gap-2 text-base">
                    <span>Last dimension:</span>
                    <span>{data?.character.location.dimension}</span>
                  </div>

                  <div className="flex flex-row flex-wrap w-full gap-2 text-base">
                    <span>Origin:</span>
                    <span>{data?.character.origin.name}</span>
                  </div>
                  <div className="flex flex-row flex-wrap w-full gap-2 text-base">
                    <span>Species:</span>
                    <span>{data?.character.species}</span>
                  </div>
                  {data?.character.type && (
                    <div className="flex flex-row flex-wrap w-full gap-2 text-base">
                      <span>Type:</span>
                      <span>{data?.character.type}</span>
                    </div>
                  )}
                  <div className="flex flex-row flex-wrap w-full gap-2 text-base">
                    <span>Gender:</span>
                    <span>{data?.character.gender}</span>
                  </div>
                  <div className="flex flex-row flex-wrap w-full gap-2 text-base">
                    <span>First seen in:</span>
                    {data?.character.episode.map(
                      (
                        episode: { name: string; air_date: string },
                        index: number
                      ) => {
                        if (index === 0) {
                          return (
                            <span key={index}>
                              {episode.name} - {episode.air_date}
                            </span>
                          );
                        }
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
