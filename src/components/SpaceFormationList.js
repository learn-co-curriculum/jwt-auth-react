import React from 'react'

const SpaceFormationList = (props) => {
  function listFormations() {
    return props.spaceFormations.map(formation => {
      return (
        <div className="col-lg-12">
          <div className="col-lg-6 col-lg-offset-3 well">
            <div className="col-lg-3">
              <img src={formation.image_url} className="thumbnail responsive" style={{height: '220px', width: '221px'}}/>
            </div>
            <div className="col-lg-6 col-lg-offset-3">
              <h3>{formation.name}</h3>
              <p>{formation.description}</p>
            </div>
          </div>
        </div>
      )
    })
  }
  return (
    <div>
      {listFormations()}
    </div>
  )
}

export default SpaceFormationList