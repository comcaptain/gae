package sgq.cmd;

import com.opensymphony.xwork2.ActionSupport;

public class HelloWorldAction extends ActionSupport{
	/**
	 * 
	 */
	private static final long serialVersionUID = 4824535574381752166L;
	private String name;

	public String execute() throws Exception {
		return SUCCESS;
	}
	   
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}
}