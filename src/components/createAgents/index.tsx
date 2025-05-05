import magicBuild from "../../assets/magicBuild.svg";
import manualBuild from "../../assets/manualBuild.svg";
import "./index.scss";

export default function CreateAgents() {
  return (
    <main className=''>
      <h1>Launch Your Custom Specialized AI Agent</h1>
      <p>
        Enter the token's contract address We will design <br /> the most
        suitable agent for you
      </p>
      <div className='search_input_container'>
        <svg
          className='search_icon'
          xmlns='http://www.w3.org/2000/svg'
          height='20'
          width='20'
          viewBox='0 0 24 24'
          fill='#aaa'
        >
          <path d='M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.26 5.59 12.42 3 9 3S2.74 5.59 2.74 8.39c0 2.8 2.84 5.39 6.26 5.39 1.61 0 3.09-.59 4.22-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9 13c-2.21 0-4-1.79-4-4S6.79 5 9 5s4 1.79 4 4-1.79 4-4 4z' />
        </svg>
        <input type='text' placeholder='Search Address/ Token/ Tnx' />
      </div>

      <section className='create_agent_container'>
        <h2>Create New AI Agent with Template</h2>
        <div className='create_agent_items'>
          <section className='create_agent_item'>
            <img src={manualBuild} alt='manualBuild' />
            <p>Manual Build</p>
            <p>
              Manually input parameters Build your own agent and tailor every
              detail
            </p>
            <button>Create AI Agent</button>
          </section>
          <section className='create_agent_item'>
            <img src={manualBuild} alt='manualBuild' />
            <p>Manual Build</p>
            <p>
              Manually input parameters Build your own agent and tailor every
              detail
            </p>
            <button>Create AI Agent</button>
          </section>
          <section className='create_agent_item'>
            <img src={manualBuild} alt='manualBuild' />
            <p>Manual Build</p>
            <p>
              Manually input parameters Build your own agent and tailor every
              detail
            </p>
            <button>Create AI Agent</button>
          </section>
        </div>
      </section>
    </main>
  );
}
