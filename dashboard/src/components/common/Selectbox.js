import React from 'react'

const Selectbox = ({optionList, selectedOption = null, callBack, ansibleWizardType = "none"}) => {
    const options = [];
    let selected = selectedOption;
    if (selected === null) {
        selected = optionList[0];
    }
    optionList.forEach(function (option, index) {
        if(ansibleWizardType === "create_volume") {
          options.push(
              <li value={option.key} key={option.key}
                  onClick={() => callBack(option.key)}>
                  <textarea rows="1" cols="50" id="textArea" type="submit"
                  onKeyDown={() => {
                    if(event.code === "Enter" || event.code === "Tab") {
                      callBack(document.getElementById("textArea").value)
                    }
                  }}
                  onBlur={() => callBack(document.getElementById("textArea").value)}>
                    {option.key}
                  </textarea>
              </li>
          );
        } else {
          if(option.title !== null && option.title.length > 0) {
            options.push(
                <li value={option.key} key={option.key}
                    onClick={() => callBack(option.key)}>
                    <a>
                      {option.title}
                    </a>
                </li>
            );
          }
        }
        if (option.key === selectedOption) {
            selected = option
        }
    }, this);
    return (
      <div className="btn-group bootstrap-select dropdown form-control">
          <button className="btn btn-default dropdown-toggle selectbox-option" type="button"
              data-toggle="dropdown" aria-expanded="false">
              <span className="pull-left selectbox-text">{selected.title}</span>
              <span className="caret" />
          </button>
          <ul className="dropdown-menu">{options}</ul>
      </div>
    )
};

export default Selectbox
