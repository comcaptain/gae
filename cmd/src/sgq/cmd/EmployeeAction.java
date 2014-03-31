package sgq.cmd;

import com.opensymphony.xwork2.ActionSupport;

public class EmployeeAction extends ActionSupport{
	/**
	 * 
	 */
	private static final long serialVersionUID = 5459384531683521182L;
	private String name;
	private int age;
   
	public String execute() {
		return SUCCESS;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}

	public void validate() {
		if (name == null || name.trim().equals("")) {
			addFieldError("name","The name is required");
		}
		if (age < 28 || age > 65) {
			addFieldError("age","Age must be in between 28 and 65");
		}
   }
}
